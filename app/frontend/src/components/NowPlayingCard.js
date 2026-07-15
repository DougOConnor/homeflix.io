import * as React from 'react';
import{
  Button,
  Card,
  CircularProgress,
  Chip
} from '@heroui/react';
import {useNavigate} from 'react-router-dom';
import { Icon } from '@iconify/react';
import MoviePoster from '../components/MoviePoster';
import { formatDate, formatTime } from '../utils/datetime';

export default function NowPlayingCard(props) {
  const showRating = props.showRating !== false
  const navigate = useNavigate()
  const movieJson = props.movie_json
  const backdropPath = movieJson && movieJson.backdrop_path ? movieJson.backdrop_path : null

  return (
    <Card className="w-full bg-content1/80 border border-white/10 overflow-hidden">
      {/* Faded backdrop art behind the whole card */}
      {
        backdropPath ?
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{backgroundImage: `url(https://image.tmdb.org/t/p/w780${backdropPath})`}}
        /> : null
      }
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row gap-6 p-5 md:p-6">
        <div
          className={"flex-shrink-0 mx-auto sm:mx-0" + (props.link === true ? " cursor-pointer" : "")}
          onClick={props.link === true ? () => navigate("/showing/" + props.data.showing_id.toString()) : undefined}
        >
          <MoviePoster
            path={props.data.poster_path}
            className="rounded-large shadow-xl shadow-black/60 ring-1 ring-white/10"
            style={{height: 280, width: 'auto'}}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-row justify-between items-start gap-4">
            <div>
              <h2
                className={"font-marquee text-4xl md:text-5xl text-foreground leading-none" + (props.link === true ? " cursor-pointer hover:text-primary transition-colors" : "")}
                onClick={props.link === true ? () => navigate("/showing/" + props.data.showing_id.toString()) : undefined}
              >
                {props.data.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-foreground/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Icon icon="solar:calendar-linear" height={16} className="text-primary" />
                  {formatDate(props.data.showing_datetime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon icon="solar:clock-circle-linear" height={16} className="text-primary" />
                  {formatTime(props.data.showing_datetime)}
                </span>
                {
                  props.data.seats_total ?
                  <span className="flex items-center gap-1.5">
                    <Icon icon="solar:armchair-2-linear" height={16} className="text-primary" />
                    {Math.max(0, props.data.seats_total - props.data.seats_reserved)} of {props.data.seats_total} seats left
                  </span>
                  : null
                }
              </div>
            </div>

            {
              showRating && movieJson && movieJson.vote_average > 0 ?
              <div className='hidden md:flex flex-col items-center gap-1'>
                <CircularProgress
                  aria-label="Audience score"
                  value={movieJson.vote_average * 10}
                  showValueLabel={true}
                  color="primary"
                  classNames={{
                    svg: "w-12 h-12",
                    track: "stroke-white/10",
                    value: "text-[10px] font-semibold text-primary",
                  }}
                />
                <span className="text-[10px] uppercase tracking-widest text-foreground/50">Score</span>
              </div>
              : null
            }
          </div>

          {
            movieJson ?
            <div className="mt-4">
              <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3 md:line-clamp-4">{movieJson.overview}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {
                  (movieJson.genres || []).map((genre) => {
                    return (
                      <Chip
                        key={genre.id || genre.name}
                        size="sm"
                        variant="bordered"
                        className="border-white/20 text-foreground/70"
                      >
                        {genre.name}
                      </Chip>
                    )
                  })
                }
              </div>
            </div>
            : null
          }

          {
            props.link === true ?
            <div className="flex justify-end items-end flex-1 mt-6">
              <Button
                color="primary"
                radius="full"
                className="font-semibold uppercase tracking-wider px-8 shadow-marquee"
                startContent={<Icon icon="solar:ticket-bold" height={18} />}
                onClick={() => navigate("/checkout/" + props.data.showing_id.toString())}
              >
                Reserve Seats
              </Button>
            </div>
            : null
          }
        </div>
      </div>
    </Card>
  );
}
