import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react'
import quizService from '../../services/quizService.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button.jsx'

const QuizTakePage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId)
        setQuiz(response.data)
      } catch (error) {
        toast.error('Failed to fetch quiz.')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setSubmitting(true)
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const questionIndex = quiz.questions.findIndex(
          (q) => q._id === questionId
        )
        const optionIndex = selectedAnswers[questionId]
        const selectedAnswer = quiz.questions[questionIndex].options[optionIndex]

        return { questionIndex, selectedAnswer }
      })

      await quizService.submitQuiz(quizId, formattedAnswers)
      toast.success('Quiz submitted successfully!')
      navigate(`/quizzes/${quizId}/results`)
    } catch (error) {
      toast.error(error.message || 'Failed to submit quiz.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">
          Quiz not found or has no questions.
        </p>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const answeredCount = Object.keys(selectedAnswers).length

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={quiz.title || 'Take Quiz'} />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {answeredCount} answered
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* QUESTION CARD (only question + options) */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl p-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl mb-6">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-emerald-700">
            Question {currentQuestionIndex + 1}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion._id] === index

            return (
              <label
                key={index}
                className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="sr-only"
                />

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                <span className="ml-4 text-sm font-medium text-slate-700">
                  {option}
                </span>

                {isSelected && (
                  <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-500" />
                )}
              </label>
            )
          })}
        </div>
      </div>

      {/* ACTION BAR (separate section) */}
      <div className="mt-6 space-y-4">
        {/* Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} disabled={submitting}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="flex items-center justify-center gap-2">
          {quiz.questions.map((_, index) => {
            const isAnswered = selectedAnswers.hasOwnProperty(
              quiz.questions[index]._id
            )
            const isCurrent = index === currentQuestionIndex

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                disabled={submitting}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-emerald-500 text-white'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizTakePage
