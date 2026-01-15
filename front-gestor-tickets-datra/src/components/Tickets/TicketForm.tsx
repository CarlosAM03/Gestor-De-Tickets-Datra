import { useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Spinner } from 'react-bootstrap';

import type {
  CreateTicketDTO,
  UpdateTicketDTO,
} from '@/types/ticket-types/ticket.dto';

import type { ImpactLevel } from '@/types/enums';

import './TicketForm.css';

/* =============================
   Props
============================= */
interface TicketFormProps {
  mode: 'create' | 'edit';
  initialValues: CreateTicketDTO | UpdateTicketDTO;
  onSubmit: (
    values: CreateTicketDTO | UpdateTicketDTO,
  ) => Promise<void>;
  submitting?: boolean;
}

/* =============================
   Validación (1:1 con DTO)
============================= */
const buildSchema = (mode: 'create' | 'edit') =>
  Yup.object({
    clientRfc:
      mode === 'create'
        ? Yup.string().required('RFC obligatorio')
        : Yup.string().notRequired(),

    serviceContractId:
      mode === 'create'
        ? Yup.number()
            .required('Contrato obligatorio')
            .typeError('Contrato inválido')
        : Yup.number().notRequired(),

    requestedBy: Yup.string().nullable(),
    contactInfo: Yup.string().nullable(),

    impactLevel:
      mode === 'create'
        ? Yup.mixed<ImpactLevel>().required(
            'Impacto obligatorio',
          )
        : Yup.mixed<ImpactLevel>().notRequired(),

    problemDescription:
      mode === 'create'
        ? Yup.string().required(
            'Describe el problema',
          )
        : Yup.string().notRequired(),

    eventLocation: Yup.string().nullable(),
    estimatedStart: Yup.string().nullable(),

    initialFindings: Yup.string().nullable(),
    probableRootCause: Yup.string().nullable(),

    actionsTaken: Yup.string().nullable(),
    additionalNotes: Yup.string().nullable(),
    correctiveAction: Yup.boolean().nullable(),
  });

/* =============================
   Componente
============================= */
export default function TicketForm({
  mode,
  initialValues,
  onSubmit,
  submitting = false,
}: TicketFormProps) {
  const validationSchema = useMemo(
    () => buildSchema(mode),
    [mode],
  );

  return (
    <Formik<CreateTicketDTO | UpdateTicketDTO>
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values, helpers) => {
        await onSubmit(values);
        helpers.setSubmitting(false);
      }}
    >
      {() => (
        <Form noValidate className="ticket-form">
          {/* =============================
              Información general
          ============================== */}
          <h5 className="form-section">
            Información general
          </h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Solicitante
              </label>
              <Field
                name="requestedBy"
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Contacto
              </label>
              <Field
                name="contactInfo"
                className="form-control"
              />
            </div>
          </div>

          {/* =============================
              Cliente / Servicio
          ============================== */}
          <h5 className="form-section">
            Cliente y servicio
          </h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                RFC del cliente
              </label>
              <Field
                name="clientRfc"
                className="form-control"
                disabled={mode === 'edit'}
              />
              <ErrorMessage
                name="clientRfc"
                component="div"
                className="text-danger small"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Contrato de servicio
              </label>
              <Field
                name="serviceContractId"
                type="number"
                className="form-control"
                disabled={mode === 'edit'}
              />
              <ErrorMessage
                name="serviceContractId"
                component="div"
                className="text-danger small"
              />
            </div>
          </div>

          {/* =============================
              Incidente
          ============================== */}
          <h5 className="form-section">Incidente</h5>

          <div className="mb-3">
            <label className="form-label">
              Nivel de impacto
            </label>
            <Field
              as="select"
              name="impactLevel"
              className="form-control"
              disabled={mode === 'edit'}
            >
              <option value="">Seleccionar</option>
              <option value="LOW">Bajo</option>
              <option value="MEDIUM">Medio</option>
              <option value="HIGH">Alto</option>
              <option value="CRITICAL">Crítico</option>
              <option value="INFO">
                Informativo
              </option>
            </Field>
            <ErrorMessage
              name="impactLevel"
              component="div"
              className="text-danger small"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Ubicación del evento
            </label>
            <Field
              name="eventLocation"
              as="textarea"
              rows={2}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Descripción del problema
            </label>
            <Field
              name="problemDescription"
              as="textarea"
              rows={4}
              className="form-control"
            />
            <ErrorMessage
              name="problemDescription"
              component="div"
              className="text-danger small"
            />
          </div>

          {/* =============================
              Diagnóstico / Cierre
          ============================== */}
          {mode === 'edit' && (
            <>
              <h5 className="form-section">
                Diagnóstico
              </h5>

              <Field
                name="initialFindings"
                as="textarea"
                rows={3}
                className="form-control mb-3"
              />

              <Field
                name="probableRootCause"
                as="textarea"
                rows={3}
                className="form-control mb-3"
              />

              <h5 className="form-section">Cierre</h5>

              <Field
                name="actionsTaken"
                as="textarea"
                rows={3}
                className="form-control mb-3"
              />

              <Field
                name="additionalNotes"
                as="textarea"
                rows={3}
                className="form-control mb-3"
              />

              <div className="form-check mb-4">
                <Field
                  type="checkbox"
                  name="correctiveAction"
                  className="form-check-input"
                />
                <label className="form-check-label">
                  Acción correctiva aplicada
                </label>
              </div>
            </>
          )}

          {/* =============================
              Acciones
          ============================== */}
          <div className="form-actions">
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
