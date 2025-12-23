import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Button, Spinner } from 'react-bootstrap';

import { searchClients } from '@/api/clients.api';
import type {
  TicketFormValues,
  TicketClient,
  TicketStatus,
} from '@/types/ticket.types';

import './TicketForm.css';

/* =============================
   Constantes
============================= */
const EMPTY_CLIENT: TicketClient = {
  rfc: '',
  companyName: '',
  businessName: '',
  location: '',
};

const STATUS_OPTIONS: TicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'ON_HOLD',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
];

/* =============================
   Props
============================= */
interface TicketFormProps {
  mode: 'create' | 'edit';
  initialValues: TicketFormValues;
  onSubmit: (values: TicketFormValues) => Promise<void>;
  submitting?: boolean;
}

/* =============================
   Validación dinámica
============================= */
const buildSchema = (mode: 'create' | 'edit') =>
  Yup.object({
    requestedBy: Yup.string().required('Campo obligatorio'),
    contact: Yup.string().required('Campo obligatorio'),
    clientType: Yup.string().required('Selecciona un tipo'),

    client:
      mode === 'create'
        ? Yup.object({
            rfc: Yup.string().required('RFC obligatorio'),
            companyName: Yup.string().required('Razón social obligatoria'),
          })
        : Yup.mixed().notRequired(),

    serviceAffected: Yup.string().required('Campo obligatorio'),
    problemDesc: Yup.string().required('Describe el problema'),
    impactLevel: Yup.string().required('Selecciona el impacto'),

    status:
      mode === 'edit'
        ? Yup.string().required('Selecciona el estatus')
        : Yup.mixed().notRequired(),
  });

/* =============================
   Normalización payload
============================= */
function normalizePayload(
  mode: 'create' | 'edit',
  values: TicketFormValues
): TicketFormValues {
  const payload: TicketFormValues = { ...values };

  // EDIT → backend NO maneja client
  if (mode === 'edit') {
    delete payload.client;
    return payload;
  }

  // CREATE → solo enviar client si es válido
  const client = values.client;
  if (
    !client ||
    !client.rfc?.trim() ||
    !client.companyName?.trim()
  ) {
    delete payload.client;
  }

  return payload;
}

/* =============================
   Componente
============================= */
export default function TicketForm({
  mode,
  initialValues,
  onSubmit,
  submitting = false,
}: TicketFormProps) {
  const [clientSuggestions, setClientSuggestions] = useState<TicketClient[]>([]);
  const [existingClient, setExistingClient] = useState<TicketClient | null>(null);

  const validationSchema = useMemo(() => buildSchema(mode), [mode]);

  /* =============================
     Inicialización segura (EDIT)
  ============================= */
  useEffect(() => {
    if (
      mode === 'edit' &&
      initialValues.client?.rfc &&
      initialValues.client.companyName
    ) {
      setExistingClient(initialValues.client);
    } else {
      setExistingClient(null);
    }
  }, [mode, initialValues.client]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (
        values: TicketFormValues,
        helpers: FormikHelpers<TicketFormValues>
      ) => {
        const payload = normalizePayload(mode, values);
        await onSubmit(payload);
        helpers.setSubmitting(false);
      }}
    >
      {({ setFieldValue }) => (
        <Form noValidate className="ticket-form">
          {/* =============================
              Información general
          ============================== */}
          <h5 className="form-section">Información general</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Solicitante</label>
              <Field name="requestedBy" className="form-control" />
              <ErrorMessage name="requestedBy" component="div" className="text-danger small" />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Contacto</label>
              <Field name="contact" className="form-control" />
              <ErrorMessage name="contact" component="div" className="text-danger small" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tipo de cliente</label>
              <Field as="select" name="clientType" className="form-control">
                <option value="EXTERNO">Externo</option>
                <option value="INTERNO">Interno</option>
              </Field>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Nivel de impacto</label>
              <Field as="select" name="impactLevel" className="form-control">
                <option value="">Seleccionar</option>
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Medio</option>
                <option value="HIGH">Alto</option>
                <option value="CRITICAL">Crítico</option>
                <option value="INFO">Informativo</option>
              </Field>
              <ErrorMessage name="impactLevel" component="div" className="text-danger small" />
            </div>
          </div>

          {/* =============================
              Estatus (solo EDIT)
          ============================== */}
          {mode === 'edit' && (
            <div className="mb-3">
              <label className="form-label">Estatus del ticket</label>
              <Field as="select" name="status" className="form-control">
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="div" className="text-danger small" />
            </div>
          )}

          {/* =============================
              Cliente
          ============================== */}
          <h5 className="form-section">Cliente</h5>

          <div className="mb-3">
            <label className="form-label">RFC</label>
            <Field
              name="client.rfc"
              className="form-control"
              disabled={mode === 'edit' && !!existingClient}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const rfc = e.target.value.toUpperCase();
                setFieldValue('client.rfc', rfc);

                setExistingClient(null);
                setClientSuggestions([]);

                if (rfc.length < 3) {
                  setFieldValue('client', { ...EMPTY_CLIENT, rfc });
                  return;
                }

                const results = await searchClients(rfc);
                setClientSuggestions(results);

                const exactMatch = results.find(c => c.rfc === rfc);
                if (exactMatch) {
                  setFieldValue('client', exactMatch);
                  setExistingClient(exactMatch);
                  setClientSuggestions([]);
                } else {
                  setFieldValue('client', { ...EMPTY_CLIENT, rfc });
                }
              }}
            />
            <ErrorMessage name="client.rfc" component="div" className="text-danger small" />

            {existingClient && (
              <div className="text-success small mt-1">
                Cliente existente detectado, datos cargados automáticamente.
              </div>
            )}
          </div>

          {clientSuggestions.length > 0 && (
            <div className="list-group mb-3">
              {clientSuggestions.map(client => (
                <button
                  key={client.rfc}
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setFieldValue('client', client);
                    setExistingClient(client);
                    setClientSuggestions([]);
                  }}
                >
                  <strong>{client.rfc}</strong> – {client.companyName}
                </button>
              ))}
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Razón social</label>
              <Field
                name="client.companyName"
                className="form-control"
                disabled={!!existingClient}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre comercial</label>
              <Field
                name="client.businessName"
                className="form-control"
                disabled={!!existingClient}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <Field
              name="client.location"
              className="form-control"
              disabled={!!existingClient}
            />
          </div>

          {/* =============================
              Incidente
          ============================== */}
          <h5 className="form-section">Incidente</h5>

          <div className="mb-3">
            <label className="form-label">Servicio afectado</label>
            <Field name="serviceAffected" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción del problema</label>
            <Field name="problemDesc" as="textarea" rows={4} className="form-control" />
          </div>

          {/* =============================
              Diagnóstico / Cierre
          ============================== */}
          {mode === 'edit' && (
            <>
              <h5 className="form-section">Diagnóstico</h5>

              <div className="mb-3">
                <label className="form-label">Hallazgos iniciales</label>
                <Field name="initialFindings" as="textarea" rows={3} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Causa raíz probable</label>
                <Field name="probableRootCause" as="textarea" rows={3} className="form-control" />
              </div>

              <h5 className="form-section">Cierre</h5>

              <div className="mb-3">
                <label className="form-label">Acciones tomadas</label>
                <Field name="actionsTaken" as="textarea" rows={3} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Notas adicionales</label>
                <Field name="additionalNotes" as="textarea" rows={3} className="form-control" />
              </div>

              <div className="form-check mb-4">
                <Field type="checkbox" name="correctiveAction" className="form-check-input" />
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
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : 'Guardar'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
