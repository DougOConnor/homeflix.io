import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Card, CardBody, Button, Input, Textarea, Switch, Chip,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const emptyForm = { name: '', description: '', price: '' };

const SnacksScreen = (props) => {
    const [snacks, setSnacks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [editing, setEditing] = useState(null); // null | 'new' | snack object
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const fileInputRef = useRef(null);
    const [uploadTarget, setUploadTarget] = useState(null);

    const fetchSnacks = () => {
        axios.get('/api/v1/menu/all').then(response => {
            setSnacks(response.data);
            setLoaded(true);
        });
    }

    useEffect(() => {
        fetchSnacks();
    }, []);

    const openEditor = (snack) => {
        setConfirmingDelete(false);
        if (snack) {
            setEditing(snack);
            setForm({ name: snack.name, description: snack.description || '', price: snack.price != null ? snack.price.toString() : '' });
        } else {
            setEditing('new');
            setForm(emptyForm);
        }
    }

    const save = () => {
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        setSaving(true);
        const price = form.price.toString().trim() === '' ? null : parseFloat(form.price);
        const payload = { name: form.name.trim(), description: form.description, price: (price === null || isNaN(price)) ? null : price };
        const request = editing === 'new'
            ? axios.post('/api/v1/menu', payload)
            : axios.post('/api/v1/menu/' + editing.snack_id, payload);
        request.then(() => {
            toast.success(editing === 'new' ? 'Snack added' : 'Snack updated');
            setEditing(null);
            fetchSnacks();
        }).finally(() => setSaving(false));
    }

    const deleteSnack = () => {
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            return;
        }
        setSaving(true);
        axios.delete('/api/v1/menu/' + editing.snack_id).then(() => {
            toast.success('Snack deleted');
            setEditing(null);
            fetchSnacks();
        }).finally(() => setSaving(false));
    }

    const toggleAvailable = (snack, available) => {
        axios.post('/api/v1/menu/' + snack.snack_id, { available: available }).then(() => {
            fetchSnacks();
        });
    }

    const pickImage = (snack) => {
        setUploadTarget(snack);
        fileInputRef.current.click();
    }

    const uploadImage = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file || !uploadTarget) return;
        const data = new FormData();
        data.append('image', file);
        axios.post('/api/v1/menu/' + uploadTarget.snack_id + '/image', data).then(() => {
            toast.success('Image updated');
            fetchSnacks();
        }).catch(error => {
            toast.error(error.response && error.response.data.error ? error.response.data.error : 'Upload failed');
        });
        e.target.value = null;
    }

    return (
        <div className='w-full min-h-screen bg-spotlight flex justify-center'>
            <div className='w-full max-w-4xl px-8 pt-10 pb-16'>
                <div className='flex items-end justify-between mb-8'>
                    <div>
                        <h1 className='font-marquee text-4xl text-foreground tracking-wider mb-1'>Snacks</h1>
                        <p className='text-foreground/50 text-sm'>The concession stand — guests can add these at checkout.</p>
                    </div>
                    <Button
                        color='primary'
                        className='font-semibold uppercase tracking-wider'
                        startContent={<Icon icon="solar:add-circle-linear" height={18} />}
                        onClick={() => openEditor(null)}
                    >
                        Add Snack
                    </Button>
                </div>

                {
                    loaded && snacks.length === 0 ?
                    <div className='border border-dashed border-white/15 rounded-large p-12 text-center'>
                        <Icon icon="solar:chef-hat-linear" height={48} className='text-foreground/15 mb-3 inline-block' />
                        <p className='text-foreground/40'>No snacks yet. Add your first concession item.</p>
                    </div>
                    : null
                }

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {
                        snacks.map(snack => (
                            <Card key={snack.snack_id} className='bg-content1/80 border border-white/10'>
                                <CardBody className='p-4'>
                                    <div className='flex gap-4'>
                                        <div
                                            className='w-20 h-20 rounded-medium bg-content2 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer group relative'
                                            onClick={() => pickImage(snack)}
                                            title='Upload image'
                                        >
                                            {
                                                snack.image_path ?
                                                <img src={snack.image_path} alt={snack.name} className='w-full h-full object-cover' />
                                                : <Icon icon="solar:chef-hat-linear" height={28} className='text-foreground/25' />
                                            }
                                            <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                                <Icon icon="solar:upload-linear" height={20} className='text-white' />
                                            </div>
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <div className='flex items-start justify-between gap-2'>
                                                <p className='font-semibold text-foreground'>{snack.name}</p>
                                                {
                                                    snack.price != null ?
                                                    <Chip size='sm' variant='flat' color='secondary' className='font-semibold flex-shrink-0'>
                                                        ${snack.price.toFixed(2)}
                                                    </Chip>
                                                    : null
                                                }
                                            </div>
                                            <p className='text-xs text-foreground/50 mt-1 line-clamp-2'>{snack.description}</p>
                                            <div className='flex items-center justify-between mt-3'>
                                                <Switch
                                                    size='sm'
                                                    isSelected={snack.available}
                                                    onValueChange={(value) => toggleAvailable(snack, value)}
                                                >
                                                    <span className='text-xs text-foreground/60'>{snack.available ? 'Available' : 'Hidden'}</span>
                                                </Switch>
                                                <Button
                                                    size='sm'
                                                    variant='flat'
                                                    color='primary'
                                                    className='font-semibold'
                                                    startContent={<Icon icon="solar:pen-linear" height={14} />}
                                                    onClick={() => openEditor(snack)}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    }
                </div>

                <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={uploadImage} />

                <Modal isOpen={editing !== null} onClose={() => setEditing(null)} classNames={{base: "bg-content1 border border-white/10"}}>
                    <ModalContent>
                        <ModalHeader className='font-marquee text-2xl tracking-wide'>
                            {editing === 'new' ? 'Add Snack' : 'Edit Snack'}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label='Name'
                                variant='bordered'
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                            <Textarea
                                label='Description'
                                variant='bordered'
                                minRows={2}
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                            <Input
                                label='Price (optional)'
                                type='number'
                                min='0'
                                step='0.25'
                                variant='bordered'
                                description='Leave blank for no price.'
                                startContent={<span className='text-default-400'>$</span>}
                                value={form.price}
                                onChange={(e) => setForm({...form, price: e.target.value})}
                            />
                            {
                                editing !== 'new' && editing !== null ?
                                <p className='text-xs text-foreground/40'>Tip: click the snack's photo on the card to upload an image.</p>
                                : null
                            }
                        </ModalBody>
                        <ModalFooter className={editing !== 'new' ? 'justify-between' : ''}>
                            {
                                editing !== 'new' ?
                                <Button
                                    color='danger'
                                    variant={confirmingDelete ? 'solid' : 'flat'}
                                    startContent={<Icon icon="solar:trash-bin-trash-linear" height={16} />}
                                    onClick={deleteSnack}
                                    isDisabled={saving}
                                >
                                    {confirmingDelete ? 'Confirm Delete' : 'Delete'}
                                </Button>
                                : null
                            }
                            <div className='flex gap-2'>
                                <Button variant='light' onClick={() => setEditing(null)} isDisabled={saving}>Cancel</Button>
                                <Button color='primary' className='font-semibold uppercase tracking-wider' onClick={save} isLoading={saving}>
                                    Save
                                </Button>
                            </div>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default SnacksScreen;
