import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import WeekendModal from './components/WeekendModal'
import { supabase } from './lib/supabase'
import { startOfMonth, endOfMonth, format } from 'date-fns'

// Family members with assigned colors
export const FAMILY_MEMBERS = [
  { name: 'Steve', color: '#3B82F6' },      // blue
  { name: 'Nehama', color: '#EC4899' },     // pink
  { name: 'Adam', color: '#10B981' },       // green
  { name: 'Meredith', color: '#F59E0B' },   // amber
  { name: 'Ben', color: '#8B5CF6' },        // purple
  { name: 'Rachel', color: '#EF4444' },     // red
  { name: 'Maya', color: '#06B6D4' },       // cyan
  { name: 'Jake', color: '#F97316' },       // orange
]

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedWeekend, setSelectedWeekend] = useState(null)
  const [weekendInterests, setWeekendInterests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeekendInterests()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('weekend_interests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'weekend_interests'
      }, () => {
        fetchWeekendInterests()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchWeekendInterests = async () => {
    try {
      const { data, error } = await supabase
        .from('weekend_interests')
        .select('*')
        .order('weekend_date', { ascending: true })

      if (error) throw error
      setWeekendInterests(data || [])
    } catch (error) {
      console.error('Error fetching weekend interests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWeekendClick = (date) => {
    setSelectedWeekend(date)
  }

  const handleCloseModal = () => {
    setSelectedWeekend(null)
  }

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4"></div>
        </div>
        <div className="text-lg font-semibold text-gray-700">Loading your calendar...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
            Lake House Calendar
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            Plan your family trips to the lake ✨
          </p>
        </div>

        <Calendar
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
          onWeekendClick={handleWeekendClick}
          weekendInterests={weekendInterests}
        />

        {selectedWeekend && (
          <WeekendModal
            date={selectedWeekend}
            onClose={handleCloseModal}
            weekendInterests={weekendInterests}
            onUpdate={fetchWeekendInterests}
          />
        )}
      </div>
    </div>
  )
}

export default App
