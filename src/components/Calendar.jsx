import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWeekend,
  isBefore,
  startOfDay
} from 'date-fns'
import { FAMILY_MEMBERS } from '../App'

const Calendar = ({ currentMonth, onMonthChange, onWeekendClick, weekendInterests }) => {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  const getWeekendInterestsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return weekendInterests.filter(interest => interest.weekend_date === dateStr)
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handlePrevMonth}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation group"
          aria-label="Previous month"
        >
          <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            {format(currentMonth, 'MMMM')}
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-medium mt-1">
            {format(currentMonth, 'yyyy')}
          </p>
        </div>

        <button
          onClick={handleNextMonth}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation group"
          aria-label="Next month"
        >
          <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
      <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3">
        {days.map((day, i) => (
          <div key={i} className="text-center font-bold text-gray-500 text-xs md:text-sm py-3 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isWeekendDay = isWeekend(day)
        const interests = getWeekendInterestsForDate(day)
        const isToday = isSameDay(day, new Date())

        // Count tentative and confirmed
        const tentativeCount = interests.filter(i => i.status === 'tentative').length
        const confirmedCount = interests.filter(i => i.status === 'confirmed').length
        const totalInterest = tentativeCount + confirmedCount

        days.push(
          <div
            key={day}
            className={`
              relative h-[90px] md:h-[110px] p-2 md:p-4 rounded-xl
              transition-all duration-300 touch-manipulation overflow-hidden group
              ${isCurrentMonth ? 'bg-white shadow-sm' : 'bg-gray-50/50'}
              ${isCurrentMonth ? 'cursor-pointer hover:shadow-xl hover:scale-[1.03] hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50' : 'cursor-default'}
              ${isToday ? 'ring-2 ring-blue-500 shadow-lg' : ''}
              ${!isCurrentMonth ? 'opacity-40' : ''}
            `}
            onClick={() => {
              if (isCurrentMonth) {
                onWeekendClick(cloneDay)
              }
            }}
          >
            {/* Subtle gradient overlay */}
            {isCurrentMonth && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-base md:text-lg font-bold
                  ${!isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-800'}
                `}>
                  {format(day, 'd')}
                </span>

                {isToday && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-500 rounded-full">
                    Today
                  </span>
                )}
              </div>

              {isCurrentMonth && totalInterest > 0 && (
                <div className="flex-1 flex flex-col justify-between">
                  {/* Interest indicators - max 3 avatars on mobile, 4 on desktop */}
                  <div className="flex items-center gap-1">
                    {interests.slice(0, 3).map((interest, idx) => {
                      const member = FAMILY_MEMBERS.find(m => m.name === interest.person_name)
                      return (
                        <div
                          key={idx}
                          className="relative flex-shrink-0"
                          title={`${interest.person_name} - ${interest.status}`}
                        >
                          <div
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-sm"
                            style={{ backgroundColor: member?.color || '#gray' }}
                          >
                            {interest.person_name[0]}
                          </div>
                          {interest.status === 'confirmed' && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                          )}
                        </div>
                      )
                    })}
                    {interests.length > 3 && (
                      <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-sm">
                        +{interests.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Status summary - compact */}
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs">
                    {confirmedCount > 0 && (
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-100 rounded">
                        <span className="font-bold text-green-700">✓{confirmedCount}</span>
                      </div>
                    )}
                    {tentativeCount > 0 && (
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 rounded">
                        <span className="font-bold text-amber-700">?{tentativeCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

        day = addDays(day, 1)
      }

      rows.push(
        <div key={day} className="grid grid-cols-7 gap-2 md:gap-3 mb-2 md:mb-3">
          {days}
        </div>
      )
      days = []
    }

    return <div>{rows}</div>
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-bold">?</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Tentative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Tap to add</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
