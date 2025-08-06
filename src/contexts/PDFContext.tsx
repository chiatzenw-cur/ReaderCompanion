import React, { createContext, useContext, useState } from 'react'
import { PDFFile, TextSelection, PDFContextValue } from '../types'

const PDFContext = createContext<PDFContextValue | undefined>(undefined)

export function PDFProvider({ children }: { children: React.ReactNode }) {
  const [currentFile, setCurrentFile] = useState<PDFFile | null>(null)
  const [currentSelection, setCurrentSelection] = useState<TextSelection | null>(null)

  const loadPDF = (file: PDFFile) => {
    setCurrentFile(file)
    setCurrentSelection(null)
  }

  return (
    <PDFContext.Provider value={{
      currentFile,
      loadPDF,
      currentSelection,
      setCurrentSelection
    }}>
      {children}
    </PDFContext.Provider>
  )
}

export function usePDF() {
  const context = useContext(PDFContext)
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider')
  }
  return context
}