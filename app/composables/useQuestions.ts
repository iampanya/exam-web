export interface Option {
  id: string
  text: string
  textTh: string
  analysis: string
}

export interface Question {
  id: number
  question: string
  questionTh: string
  options: Option[]
  correctOptionId: string
  explanation: string
  referenceLink?: string
  studyTechnique?: string
}

export const useQuestions = () => {
  // Use Vite's import.meta.glob to eagerly load all JSON files in the data directory
  const modules = import.meta.glob('../../data/*.json', { eager: true, import: 'default' })
  
  // Flatten all arrays of questions from all json files into a single array
  let allQuestions: Question[] = []
  Object.values(modules).forEach((fileData: any) => {
    if (Array.isArray(fileData)) {
      allQuestions = [...allQuestions, ...fileData]
    }
  })
  
  // Sort questions by their original ID from the JSON files
  allQuestions.sort((a, b) => a.id - b.id)

  const getPaginatedQuestions = (page: number, itemsPerPage: number = 5) => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    return allQuestions.slice(start, end)
  }

  const totalPages = Math.ceil(allQuestions.length / 5)

  return {
    allQuestions,
    getPaginatedQuestions,
    totalPages
  }
}
