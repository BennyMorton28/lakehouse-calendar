import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { FAMILY_MEMBERS } from '../App'

const WeekendModal = ({ date, onClose, weekendInterests, onUpdate }) => {
  const [selectedPerson, setSelectedPerson] = useState('')
  const [status, setStatus] = useState('tentative')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const dateStr = format(date, 'yyyy-MM-dd')
  const displayDate = format(date, 'EEEE, MMMM d, yyyy')
  const currentInterests = weekendInterests.filter(interest => interest.weekend_date === dateStr)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPerson) return

    setSaving(true)
    try {
      // Check if this person already has an entry for this weekend
      const existingInterest = currentInterests.find(i => i.person_name === selectedPerson)

      if (existingInterest) {
        // Update existing entry
        const { error } = await supabase
          .from('weekend_interests')
          .update({
            status,
            notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingInterest.id)

        if (error) throw error
      } else {
        // Insert new entry
        const { error } = await supabase
          .from('weekend_interests')
          .insert([{
            weekend_date: dateStr,
            person_name: selectedPerson,
            status,
            notes
          }])

        if (error) throw error
      }

      // Reset form
      setSelectedPerson('')
      setStatus('tentative')
      setNotes('')

      // Refresh data
      onUpdate()
    } catch (error) {
      console.error('Error saving interest:', error)
      alert('Error saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (interestId) => {
    if (!confirm('Remove this interest?')) return

    try {
      const { error } = await supabase
        .from('weekend_interests')
        .delete()
        .eq('id', interestId)

      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('Error deleting interest:', error)
      alert('Error deleting. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 rounded-t-3xl md:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {displayDate}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Current Interests */}
          {currentInterests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Who's Interested:</h3>
              <div className="space-y-2">
                {currentInterests.map((interest) => {
                  const member = FAMILY_MEMBERS.find(m => m.name === interest.person_name)
                  return (
                    <div
                      key={interest.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: member?.color || '#gray' }}
                      >
                        {interest.person_name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">{interest.person_name}</span>
                          <span className={`
                            text-xs px-2 py-1 rounded-full font-medium
                            ${interest.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                            }
                          `}>
                            {interest.status === 'confirmed' ? '✓ Confirmed' : '? Tentative'}
                          </span>
                        </div>
                        {interest.notes && (
                          <p className="text-sm text-gray-600 mt-1">{interest.notes}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(interest.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors touch-manipulation flex-shrink-0"
                        title="Remove"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add Interest Form */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Interest:</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Person Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who wants to go?
                </label>
                <select
                  value={selectedPerson}
                  onChange={(e) => setSelectedPerson(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base touch-manipulation"
                  required
                >
                  <option value="">Select a person...</option>
                  {FAMILY_MEMBERS.map((member) => (
                    <option key={member.name} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('tentative')}
                    className={`
                      p-3 rounded-lg font-medium transition-all touch-manipulation
                      ${status === 'tentative'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    ? Tentative
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('confirmed')}
                    className={`
                      p-3 rounded-lg font-medium transition-all touch-manipulation
                      ${status === 'confirmed'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    ✓ Confirmed
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the weekend..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedPerson || saving}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation text-base"
              >
                {saving ? 'Saving...' : 'Add Interest'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekendModal
