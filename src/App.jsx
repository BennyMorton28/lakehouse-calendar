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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Lake House Calendar
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Plan your family weekends at the lake
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
