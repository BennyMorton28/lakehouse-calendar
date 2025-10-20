import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { FAMILY_MEMBERS } from '../App'

const WeekendModal = ({ date, onClose, weekendInterests, onUpdate }) => {
  const [selectedPeople, setSelectedPeople] = useState([])
  const [status, setStatus] = useState('tentative')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const dateStr = format(date, 'yyyy-MM-dd')
  const displayDate = format(date, 'EEEE, MMMM d, yyyy')
  const currentInterests = weekendInterests.filter(interest => interest.weekend_date === dateStr)

  const togglePerson = (personName) => {
    setSelectedPeople(prev =>
      prev.includes(personName)
        ? prev.filter(name => name !== personName)
        : [...prev, personName]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedPeople.length === 0) return

    setSaving(true)
    try {
      // Insert or update for each selected person
      for (const personName of selectedPeople) {
        const existingInterest = currentInterests.find(i => i.person_name === personName)

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
              person_name: personName,
              status,
              notes
            }])

          if (error) throw error
        }
      }

      setSelectedPeople([])
      setStatus('tentative')
      setNotes('')
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp md:animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8 rounded-t-3xl shadow-lg z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Weekend Plans
                </h2>
              </div>
              <p className="text-blue-100 text-base md:text-lg font-medium">
                {displayDate}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors touch-manipulation ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Current Interests */}
          {currentInterests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Who's Coming ({currentInterests.length})
              </h3>
              <div className="space-y-3">
                {currentInterests.map((interest) => {
                  const member = FAMILY_MEMBERS.find(m => m.name === interest.person_name)
                  return (
                    <div
                      key={interest.id}
                      className="group flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 hover:from-blue-50 hover:to-indigo-50 rounded-2xl transition-all duration-200 border border-gray-200/50"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md"
                        style={{ backgroundColor: member?.color || '#gray' }}
                      >
                        {interest.person_name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-gray-900 text-lg">{interest.person_name}</span>
                          <span className={`
                            text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1
                            ${interest.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                            }
                          `}>
                            {interest.status === 'confirmed' ? (
                              <>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Confirmed
                              </>
                            ) : (
                              <>? Tentative</>
                            )}
                          </span>
                        </div>
                        {interest.notes && (
                          <p className="text-sm text-gray-600 mt-2 bg-white/80 p-2 rounded-lg">{interest.notes}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(interest.id)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-100 transition-colors touch-manipulation opacity-0 group-hover:opacity-100"
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
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add People
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Multi-Person Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Who wants to go? (select multiple)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FAMILY_MEMBERS.map((member) => {
                    const isSelected = selectedPeople.includes(member.name)
                    const alreadyAdded = currentInterests.some(i => i.person_name === member.name)

                    return (
                      <button
                        key={member.name}
                        type="button"
                        onClick={() => togglePerson(member.name)}
                        disabled={alreadyAdded}
                        className={`
                          relative p-4 rounded-xl font-bold transition-all touch-manipulation flex items-center gap-3
                          ${isSelected
                            ? 'bg-white shadow-lg ring-2 scale-105'
                            : alreadyAdded
                            ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                            : 'bg-white hover:shadow-md hover:scale-102'
                          }
                        `}
                        style={{
                          ringColor: isSelected ? member.color : 'transparent'
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md flex-shrink-0"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name[0]}
                        </div>
                        <span className={`text-left flex-1 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                          {member.name}
                        </span>
                        {isSelected && (
                          <svg className="w-5 h-5 flex-shrink-0" style={{ color: member.color }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {alreadyAdded && (
                          <span className="text-xs text-gray-500">Added</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {selectedPeople.length > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-700">
                      {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'} selected: {selectedPeople.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Commitment Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('tentative')}
                    className={`
                      p-4 rounded-xl font-bold transition-all touch-manipulation flex flex-col items-center gap-2
                      ${status === 'tentative'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300'
                      }
                    `}
                  >
                    <span className="text-2xl">?</span>
                    <span className="text-sm">Tentative</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('confirmed')}
                    className={`
                      p-4 rounded-xl font-bold transition-all touch-manipulation flex flex-col items-center gap-2
                      ${status === 'confirmed'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
                      }
                    `}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Confirmed</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any details about the trip..."
                  rows="3"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={selectedPeople.length === 0 || saving}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl touch-manipulation text-base flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add {selectedPeople.length > 0 ? `${selectedPeople.length} ${selectedPeople.length === 1 ? 'Person' : 'People'}` : 'Interest'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekendModal
