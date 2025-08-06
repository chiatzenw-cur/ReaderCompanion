import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import Tesseract from 'tesseract.js'
import { usePDF } from '../contexts/PDFContext'
import { useChat } from '../contexts/ChatContext'
import { TextSelection } from '../types'

// Set up PDF.js worker - use URL import for bundling
if (typeof window !== 'undefined') {
  // Use dynamic import to get the worker URL that gets bundled correctly
  try {
    const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
  } catch (error) {
    // Fallback to CDN if bundled worker fails
    console.warn('Using CDN worker as fallback:', error)
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.mjs'
  }
}

interface SelectionArea {
  startX: number
  startY: number
  endX: number
  endY: number
  isSelecting: boolean
}

interface PDFViewerProps {
  onTextSelect?: (selection: TextSelection) => void
}

export function PDFViewer({ onTextSelect }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null)
  const { currentFile, setCurrentSelection } = usePDF()
  const { sendMessage } = useChat()
  
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.5)
  const [isLoading, setIsLoading] = useState(false)
  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  const [selectionArea, setSelectionArea] = useState<SelectionArea>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isSelecting: false
  })

  // Load PDF document
  useEffect(() => {
    if (!currentFile) return

    setIsLoading(true)
    const uint8Array = new Uint8Array(currentFile.buffer)
    
    pdfjsLib.getDocument({ data: uint8Array }).promise
      .then(pdf => {
        setPdfDocument(pdf)
        setTotalPages(pdf.numPages)
        setCurrentPage(1)
      })
      .catch(error => {
        console.error('Error loading PDF:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [currentFile])

  // Render current page
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current || !selectionCanvasRef.current) return

    const canvas = canvasRef.current
    const selectionCanvas = selectionCanvasRef.current
    const context = canvas.getContext('2d')!

    pdfDocument.getPage(currentPage).then(page => {
      const viewport = page.getViewport({ scale })

      // Set canvas dimensions
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      // Set selection canvas dimensions (overlay)
      selectionCanvas.width = viewport.width
      selectionCanvas.height = viewport.height
      selectionCanvas.style.width = `${viewport.width}px`
      selectionCanvas.style.height = `${viewport.height}px`

      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      page.render(renderContext)
    })
  }, [pdfDocument, currentPage, scale])

  // Selection handlers using React events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('Mouse down on selection canvas - React event')
    e.preventDefault()
    
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    console.log('Selection start:', { x, y })
    
    setSelectionArea({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      isSelecting: true
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectionArea.isSelecting) return
    
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setSelectionArea(prev => ({
      ...prev,
      endX: x,
      endY: y
    }))
    
    // Draw selection rectangle
    requestAnimationFrame(() => drawSelectionRectangle())
  }

  const handleMouseUp = () => {
    if (!selectionArea.isSelecting) return
    
    console.log('Mouse up - performing OCR')
    setSelectionArea(prev => ({ ...prev, isSelecting: false }))
    
    // Perform OCR on selected area
    setTimeout(() => performOCR(), 0)
  }

  // Handle mouse leave to cancel selection
  const handleMouseLeave = () => {
    if (selectionArea.isSelecting) {
      setSelectionArea(prev => ({ ...prev, isSelecting: false }))
      // Clear selection canvas
      if (selectionCanvasRef.current) {
        const ctx = selectionCanvasRef.current.getContext('2d')!
        ctx.clearRect(0, 0, selectionCanvasRef.current.width, selectionCanvasRef.current.height)
      }
    }
  }

  // Draw selection rectangle
  const drawSelectionRectangle = (area: SelectionArea = selectionArea) => {
    if (!selectionCanvasRef.current) return
    
    const canvas = selectionCanvasRef.current
    const ctx = canvas.getContext('2d')!
    
    // Clear previous selection
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (!area.isSelecting) return
    
    const width = area.endX - area.startX
    const height = area.endY - area.startY
    
    // Draw selection rectangle
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(area.startX, area.startY, width, height)
    
    // Draw fill with transparency
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
    ctx.fillRect(area.startX, area.startY, width, height)
  }

  // Perform OCR on selected area
  const performOCR = async () => {
    if (!canvasRef.current || !selectionCanvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    
    // Calculate selection bounds
    const left = Math.min(selectionArea.startX, selectionArea.endX)
    const top = Math.min(selectionArea.startY, selectionArea.endY)
    const width = Math.abs(selectionArea.endX - selectionArea.startX)
    const height = Math.abs(selectionArea.endY - selectionArea.startY)
    
    // Skip if selection is too small
    if (width < 10 || height < 10) return
    
    try {
      setIsOcrProcessing(true)
      
      // Extract selected area from canvas
      const imageData = ctx.getImageData(left, top, width, height)
      
      // Create a temporary canvas for the selected area
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = width
      tempCanvas.height = height
      const tempCtx = tempCanvas.getContext('2d')!
      tempCtx.putImageData(imageData, 0, 0)
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        tempCanvas.toBlob((blob) => resolve(blob!), 'image/png')
      })
      
      // Perform OCR
      const { data: { text } } = await Tesseract.recognize(blob, 'chi_sim+eng', {
        logger: m => console.log(m)
      })
      
      // Clean up OCR text
      const cleanedText = text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim()
      
      if (cleanedText.length > 3) {
        const textSelection: TextSelection = {
          text: cleanedText,
          pageNumber: currentPage,
          boundingRect: new DOMRect(left, top, width, height),
          timestamp: Date.now()
        }
        
        setCurrentSelection(textSelection)
        onTextSelect?.(textSelection)
        
        // Automatically send to AI for analysis
        sendMessage('请分析这段文本并提供相关解释', textSelection)
      }
      
      // Clear selection
      const selectionCtx = selectionCanvasRef.current!.getContext('2d')!
      selectionCtx.clearRect(0, 0, selectionCanvasRef.current!.width, selectionCanvasRef.current!.height)
      
    } catch (error) {
      console.error('OCR failed:', error)
    } finally {
      setIsOcrProcessing(false)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault()
            setScale(prev => Math.min(prev * 1.2, 3))
            break
          case '-':
            e.preventDefault()
            setScale(prev => Math.max(prev / 1.2, 0.5))
            break
          case '0':
            e.preventDefault()
            setScale(1.5)
            break
        }
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setCurrentPage(prev => Math.max(prev - 1, 1))
          break
        case 'ArrowRight':
          e.preventDefault()
          setCurrentPage(prev => Math.min(prev + 1, totalPages))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalPages])

  if (!currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            选择一个PDF文件
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            使用 Ctrl+O 或点击菜单来打开PDF文件
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            💡 提示：打开PDF后，用鼠标拖拽选择文本区域，系统将自动进行OCR识别并发送给AI分析
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
            className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            第 {currentPage} 页 / 共 {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            →
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setScale(prev => Math.max(prev / 1.2, 0.5))}
            className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            -
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(prev => Math.min(prev * 1.2, 3))}
            className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            +
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
          {currentFile.name}
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-4" ref={containerRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">加载中...</div>
          </div>
        ) : (
          <div className="relative mx-auto" style={{ width: 'fit-content' }}>
            <canvas
              ref={canvasRef}
              className="border border-gray-300 dark:border-gray-600 shadow-lg"
            />
            <canvas
              ref={selectionCanvasRef}
              className="absolute top-0 left-0 cursor-crosshair"
              style={{ 
                pointerEvents: 'auto', 
                zIndex: 10,
                backgroundColor: 'transparent'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
            {isOcrProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">OCR识别中...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}