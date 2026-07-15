import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import {Input, Card, CardFooter, Image, Chip, Button, ScrollShadow} from "@heroui/react";
import { Icon } from '@iconify/react';
import axios from 'axios'

import EditShowingModal from "../../components/EditShowingModal";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const formatShowingDate = (value) => {
  const dateObj = new Date(value)
  if (isNaN(dateObj)) return value
  const date = days[dateObj.getDay()] + ", " + dateObj.toLocaleString('default', { month: 'short' }) + " " + dateObj.getDate()
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  return date + " · " + time
}

const AdminAddMovieScreen = (props) => {
  const navigate = useNavigate()
  const emptyResults = {results: []}
  const [results, setResults] = useState(emptyResults)
  const [hasQuery, setHasQuery] = useState(false)
  const [showings, setShowings] = useState([])
  const [showingsLoaded, setShowingsLoaded] = useState(false)
  const [editingShowing, setEditingShowing] = useState(null)

  const fetchShowings = () => {
    axios.get("/api/v1/showings").then(response => {
      setShowings(response.data)
      setShowingsLoaded(true)
    })
  }

  useEffect(() => {
    fetchShowings()
  }, [])

  const searchChangeHandler = (e) => {
    let q = e.target.value
    let dontSend = [undefined, '']
    let check = dontSend.indexOf(q)
    if (check === -1) {
      setHasQuery(true)
      axios.get(
        "/api/v1/tmdb/search?q=" + e.target.value
      ).then(results => setResults(results.data))
    } else {
      setHasQuery(false)
      setResults(emptyResults)
    }
  }


  return (
    <div className='w-full flex justify-center min-h-screen bg-spotlight'>
      <div className='w-full pt-10 pb-16 flex flex-col max-w-6xl px-8'>
        <h1 className='font-marquee text-4xl text-foreground tracking-wider mb-1'>Showings</h1>
        <p className='text-foreground/50 text-sm mb-6'>Manage what's playing at your theater.</p>

        {/* Scheduled showings */}
        <div className="mb-10">
          <h2 className='text-sm font-semibold uppercase tracking-widest text-foreground/50 mb-4'>Scheduled</h2>
          {
            showingsLoaded && showings.length === 0 ?
            <div className='border border-dashed border-white/15 rounded-large p-8 text-center'>
              <p className='text-foreground/40'>Nothing scheduled yet. Search below to add your first showing.</p>
            </div>
            : null
          }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              showings.map(showing => (
                <Card key={showing.showing_id} className='bg-content1/80 border border-white/10'>
                  <div className='flex flex-row gap-4 p-4'>
                    <img
                      src={showing.poster_path ? "https://image.tmdb.org/t/p/w185/" + showing.poster_path : "/tmdb/blank-poster.png"}
                      alt={showing.title}
                      className='w-16 rounded-medium object-cover ring-1 ring-white/10 flex-shrink-0'
                    />
                    <div className='flex flex-col min-w-0 flex-1'>
                      <p className='font-semibold text-foreground truncate'>{showing.title}</p>
                      <p className='text-xs text-foreground/50 mt-1 flex items-center gap-1.5'>
                        <Icon icon="solar:calendar-linear" height={14} className='text-primary flex-shrink-0' />
                        <span className='truncate'>{formatShowingDate(showing.showing_datetime)}</span>
                      </p>
                      <div className='flex-1' />
                      <div className='flex justify-end'>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          className='font-semibold'
                          startContent={<Icon icon="solar:pen-linear" height={14} />}
                          onClick={() => setEditingShowing(showing)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        </div>

        {/* Add a new showing */}
        <div className="flex flex-col flex-1">
          <h2 className='text-sm font-semibold uppercase tracking-widest text-foreground/50 mb-4'>Add a Showing</h2>
          <Input
            size="lg"
            variant="bordered"
            placeholder="Search for a movie..."
            startContent={<Icon icon="solar:magnifer-linear" height={20} className="text-default-400" />}
            onChange={(e) => searchChangeHandler(e)}
          />
          <img
            className='mt-3 opacity-60 self-start'
            style={{height: 10}}
            alt="TMDB"
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg"
          />
          {
            !hasQuery ?
            <div className='flex flex-col items-center justify-center text-center py-16'>
              <Icon icon="solar:clapperboard-open-play-linear" height={56} className="text-foreground/15 mb-4" />
              <p className='text-foreground/40'>Start typing to search the movie database.</p>
            </div>
            :
            <ScrollShadow className="w-full pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {
                  results.results.map(result => {
                    return (
                      <Card
                        key={result.id}
                        isPressable
                        onPress={() => navigate('/admin/add-movie/' + result.id)}
                        className='bg-content1/80 border border-white/10 group'
                      >
                        <Image
                          radius="none"
                          className="w-full object-cover"
                          src={result.poster_path ? "https://image.tmdb.org/t/p/w500/" + result.poster_path : "/tmdb/blank-poster.png"}
                          alt={result.title}
                        />
                        <CardFooter className="flex-col items-start gap-2">
                          <p className="text-sm font-semibold text-foreground text-left line-clamp-1">{result.title}</p>
                          <div className="flex items-center justify-between w-full">
                            <p className="text-xs text-foreground/40">{result.release_date ? result.release_date.substring(0, 4) : "—"}</p>
                            <Chip
                              size="sm"
                              color="primary"
                              variant="flat"
                              className="font-semibold"
                              startContent={<Icon icon="solar:add-circle-linear" height={16} />}
                            >
                              Add
                            </Chip>
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })
                }
              </div>
            </ScrollShadow>
          }
        </div>
      </div>

      <EditShowingModal
        showing={editingShowing}
        isOpen={editingShowing !== null}
        onClose={() => setEditingShowing(null)}
        onSaved={fetchShowings}
      />
    </div>
  );

};
export default AdminAddMovieScreen;
