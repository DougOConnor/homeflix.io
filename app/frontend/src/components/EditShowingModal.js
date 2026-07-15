import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDateTime, now, getLocalTimeZone } from '@internationalized/date';

import ImagePicker from './ImagePicker';

const parseShowingDateTime = (value) => {
  try {
    return parseDateTime(value.substring(0, 16));
  } catch (e) {
    return now(getLocalTimeZone());
  }
}

// props: showing, isOpen, onClose, onSaved
const EditShowingModal = (props) => {
  const showing = props.showing;
  const [images, setImages] = useState(null);
  const [datetime, setDateTime] = useState(null);
  const [posterPath, setPosterPath] = useState(null);
  const [backdropPath, setBackdropPath] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (props.isOpen && showing) {
      setImages(null);
      setConfirmingDelete(false);
      setDateTime(parseShowingDateTime(showing.showing_datetime));
      setPosterPath(showing.poster_path);
      setBackdropPath(showing.movie_json && showing.movie_json.backdrop_path ? showing.movie_json.backdrop_path : null);
      axios.get('/api/v1/tmdb/movie/' + showing.tmdb_id + '/images').then(response => {
        setImages(response.data);
      }).catch(() => {
        setImages({posters: [], backdrops: []});
      });
    }
  }, [props.isOpen, showing]);

  const save = () => {
    setSaving(true);
    axios.post('/api/v1/showings/' + showing.showing_id, {
      showing_datetime: datetime.toString().substring(0, 16) + ":00",
      poster_path: posterPath,
      backdrop_path: backdropPath,
    }).then(() => {
      props.onSaved();
      props.onClose();
    }).finally(() => setSaving(false));
  }

  const deleteShowing = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setSaving(true);
    axios.delete('/api/v1/showings/' + showing.showing_id).then(() => {
      props.onSaved();
      props.onClose();
    }).finally(() => setSaving(false));
  }

  if (!showing) {
    return null;
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-content1 border border-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className='font-marquee text-2xl tracking-wide'>Edit Showing</span>
          <span className='text-sm font-normal text-foreground/50'>{showing.title}</span>
        </ModalHeader>
        <ModalBody>
          <DatePicker
            label="Showing date & time"
            variant="bordered"
            hideTimeZone
            showMonthAndYearPickers
            value={datetime}
            onChange={(value) => setDateTime(value)}
          />

          {
            images === null ?
            <div className='flex justify-center py-8'>
              <Spinner color="primary" label="Loading artwork..." />
            </div>
            :
            <>
              <div>
                <p className='text-sm font-semibold text-foreground/70 mb-2'>Poster</p>
                <ImagePicker
                  aspect="poster"
                  images={images.posters}
                  selected={posterPath}
                  onSelect={setPosterPath}
                />
              </div>
              <div>
                <p className='text-sm font-semibold text-foreground/70 mb-2'>Backdrop</p>
                <ImagePicker
                  aspect="backdrop"
                  images={images.backdrops}
                  selected={backdropPath}
                  onSelect={setBackdropPath}
                />
              </div>
            </>
          }
        </ModalBody>
        <ModalFooter className='justify-between'>
          <Button
            color="danger"
            variant={confirmingDelete ? "solid" : "flat"}
            startContent={<Icon icon="solar:trash-bin-trash-linear" height={18} />}
            onClick={deleteShowing}
            isDisabled={saving}
          >
            {confirmingDelete ? "Confirm Delete" : "Delete"}
          </Button>
          <div className='flex gap-2'>
            <Button variant="light" onClick={props.onClose} isDisabled={saving}>
              Cancel
            </Button>
            <Button
              color="primary"
              className='font-semibold uppercase tracking-wider'
              onClick={save}
              isLoading={saving}
            >
              Save
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditShowingModal
