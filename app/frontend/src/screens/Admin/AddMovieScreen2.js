import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import {DatePicker, Button, Card, CardBody, Chip} from "@heroui/react";
import { Icon } from '@iconify/react';
import axios from 'axios'
import {now, getLocalTimeZone} from "@internationalized/date";

import ImagePicker from "../../components/ImagePicker";


const AdminAddMovieScreen = (props) => {
    const navigate = useNavigate()
    const params = useParams()
    const tmdbID = params.id.toString()
    const [movie, setMovie] = useState({})
    const [images, setImages] = useState(null)
    const [posterPath, setPosterPath] = useState(null)
    const [backdropPath, setBackdropPath] = useState(null)
    const [datetime, setDateTime] = useState(now(getLocalTimeZone()))
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        axios.get(
          '/api/v1/tmdb/movie/' + tmdbID
        ).then(response => {
            setMovie(response.data)
            setPosterPath(response.data.poster_path)
            setBackdropPath(response.data.backdrop_path)
        })
        axios.get(
          '/api/v1/tmdb/movie/' + tmdbID + '/images'
        ).then(response => {
            setImages(response.data)
        }).catch(() => {
            setImages({posters: [], backdrops: []})
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    const addShowing = () => {
      setSaving(true)
      let data = {
        "tmdb_id": tmdbID,
        "title": movie.title,
        "poster_path": posterPath,
        "showing_datetime": datetime.toString().substring(0, 16) + ":00",
        "movie_json": {...movie, poster_path: posterPath, backdrop_path: backdropPath}
      }
      axios.post(
        "/api/v1/showings",
        data
      ).then(() => {
          navigate("/admin/showings")
      }).finally(() => setSaving(false))
    }


  return (
    <div className='relative w-full min-h-screen bg-spotlight'>
      {
        backdropPath ?
        <>
          <div
            className="absolute inset-x-0 top-0 h-80 bg-cover bg-center opacity-25 pointer-events-none"
            style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${backdropPath})`}}
          />
          <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        </> : null
      }
      <div className='relative w-full max-w-5xl mx-auto flex flex-col p-8'>
        <Button
          variant="light"
          size="sm"
          className="self-start mb-6 text-foreground/60"
          startContent={<Icon icon="solar:alt-arrow-left-linear" height={16} />}
          onClick={() => navigate("/admin/showings")}
        >
          Back to showings
        </Button>

        <div className='flex flex-col md:flex-row gap-8'>
          <img
            src={posterPath ? "https://image.tmdb.org/t/p/w500/" + posterPath : "/tmdb/blank-poster.png"}
            alt={movie.title}
            className="rounded-large shadow-xl shadow-black/60 ring-1 ring-white/10 w-56 self-center md:self-start flex-shrink-0"
          />
          <div className='flex-1 min-w-0'>
            <h1 className='font-marquee text-5xl text-foreground leading-none'>{movie.title}</h1>
            <div className='flex flex-wrap items-center gap-3 mt-3'>
              {
                movie.release_date ?
                <Chip size="sm" variant="bordered" className='border-white/20 text-foreground/70'>
                  {movie.release_date.substring(0, 4)}
                </Chip> : null
              }
              {
                movie.runtime ?
                <span className='text-foreground/50 text-sm flex items-center gap-1.5'>
                  <Icon icon="solar:clock-circle-linear" height={16} className="text-primary" />
                  {movie.runtime} min
                </span> : null
              }
            </div>
            <p className='text-foreground/70 text-sm leading-relaxed mt-4'>{movie.overview}</p>

            <Card className='bg-content1/70 backdrop-blur-md border border-white/10 mt-8'>
              <CardBody className='p-6'>
                <h2 className='font-marquee text-2xl text-foreground mb-4'>Schedule Showing</h2>
                <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-end'>
                  <DatePicker
                    label="Showing date & time"
                    variant="bordered"
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    onChange={(value) => setDateTime(value)}
                    className="flex-1"
                  />
                  <Button
                    color="primary"
                    className='font-semibold uppercase tracking-wider px-8'
                    startContent={<Icon icon="solar:clapperboard-play-bold" height={18} />}
                    onClick={addShowing}
                    isLoading={saving}
                  >
                    Add Showing
                  </Button>
                </div>

                {
                  images !== null ?
                  <>
                    <div className='mt-6'>
                      <p className='text-sm font-semibold text-foreground/70 mb-2'>Poster</p>
                      <ImagePicker
                        aspect="poster"
                        images={images.posters}
                        selected={posterPath}
                        onSelect={setPosterPath}
                      />
                    </div>
                    <div className='mt-4'>
                      <p className='text-sm font-semibold text-foreground/70 mb-2'>Backdrop</p>
                      <ImagePicker
                        aspect="backdrop"
                        images={images.backdrops}
                        selected={backdropPath}
                        onSelect={setBackdropPath}
                      />
                    </div>
                  </>
                  : null
                }
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

};
export default AdminAddMovieScreen;
