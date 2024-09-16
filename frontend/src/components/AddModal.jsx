import * as yup from 'yup';
import cn from 'classnames';
import filter from 'leo-profanity';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { createChannel } from '../store/slices/channelsSlice';
import { closeModal } from '../store/slices/modalsSlice';

const AddModal = () => {
  const channels = useSelector((state) => state.channels.channels);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { t } = useTranslation();
  filter.loadDictionary('ru');

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(t('errors.required'))
      .min(2, t('errors.username'))
      .max(20, t('errors.username'))
      .notOneOf(channels, 'Должно быть уникальным'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const censured = filter.clean(values.name);
      schema.validate(values)
        .then(() => {
          dispatch(createChannel(censured));
          dispatch(closeModal());
          toast.success(t('channelsHandlers.channelAdded'));
        })
        .catch((e) => {
          formik.errors.name = e.message;
        });
    },
  });

  const inputClasses = cn('mb-2', {
    'form-control is-invalid': formik.errors.name,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal centered show="true" onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" id="name" controlId="name">
            <Form.Control
              className={inputClasses}
              type="text"
              name="name"
              ref={inputRef}
              value={formik.values.text}
              onChange={formik.handleChange}
            />
            <Form.Label className="visually-hidden">Имя канала</Form.Label>
            <div className="invalid-feedback">{formik.errors.name}</div>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn-secondary" type="button" onClick={() => dispatch(closeModal())}>Отменить</Button>
            <Button type="submit">{t('buttons.send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
