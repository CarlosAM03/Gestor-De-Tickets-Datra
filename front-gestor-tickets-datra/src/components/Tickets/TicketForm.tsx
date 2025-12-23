import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Spinner } from 'react-bootstrap';

import { searchClients } from '@/api/clients.api';
import type {
  TicketFormValues,
  TicketClient,
} from '@/types/ticket.types';

import './TicketForm.css';

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
   Validación
============================= */
const TicketSchema = Yup.object({
  requestedBy: Yup.string().required('Campo obligatorio'),
  contact: Yup.string().required('Campo obligatorio'),
  clientType: Yup.string().required('Selecciona un tipo'),

  client: Yup.object({
    rfc: Yup.string().required('RFC obligatorio'),
    companyName: Yup.string().required('Razón social obligatoria'),
  }),

  serviceAffected: Yup.string().required('Campo obligatorio'),
  problemDesc: Yup.string().required('Describe el problema'),
  impactLevel: Yup.string().required('Selecciona el impacto'),
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
  const [clientSuggestions, setClientSuggestions] = useState<TicketClient[]>([]);
  const [existingClient, setExistingClient] = useState<TicketClient | null>(
    initialValues.client ?? null
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={TicketSchema}
      enableReinitialize
      onSubmit={onSubmit}
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
              Cliente
          ============================== */}
          <h5 className="form-section">Cliente</h5>

          <div className="mb-3">
            <label className="form-label">RFC</label>
            <Field
              name="client.rfc"
              className="form-control"
              disabled={mode === 'edit'}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const rfc = e.target.value.toUpperCase();
                setFieldValue('client.rfc', rfc);
                setExistingClient(null);

                if (rfc.length >= 3) {
                  const results = await searchClients(rfc);
                  setClientSuggestions(results);

                  const exactMatch = results.find(c => c.rfc === rfc);
                  if (exactMatch) {
                    setFieldValue('client', exactMatch);
                    setExistingClient(exactMatch);
                    setClientSuggestions([]);
                  }
                } else {
                  setClientSuggestions([]);
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
              {clientSuggestions.map(c => (
                <button
                  key={c.rfc}
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setFieldValue('client', c);
                    setExistingClient(c);
                    setClientSuggestions([]);
                  }}
                >
                  <strong>{c.rfc}</strong> – {c.companyName}
                </button>
              ))}
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Razón social</label>
              <Field name="client.companyName" className="form-control" disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre comercial</label>
              <Field name="client.businessName" className="form-control" disabled />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <Field name="client.location" className="form-control" disabled />
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
