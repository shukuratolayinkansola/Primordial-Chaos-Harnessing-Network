;; Existential Risk Containment Contract

(define-map risk-events
  { event-id: uint }
  {
    risk-type: (string-ascii 64),
    severity: uint,
    containment-status: (string-ascii 20)
  }
)

(define-data-var next-event-id uint u0)

(define-public (register-risk-event (risk-type (string-ascii 64)) (severity uint))
  (let
    ((new-id (+ (var-get next-event-id) u1)))
    (var-set next-event-id new-id)
    (ok (map-set risk-events
      { event-id: new-id }
      {
        risk-type: risk-type,
        severity: severity,
        containment-status: "uncontained"
      }
    ))
  )
)

(define-public (update-containment-status (event-id uint) (new-status (string-ascii 20)))
  (let
    ((event (unwrap! (map-get? risk-events { event-id: event-id }) (err u404))))
    (ok (map-set risk-events
      { event-id: event-id }
      (merge event {
        containment-status: new-status
      })
    ))
  )
)

(define-read-only (get-risk-event (event-id uint))
  (map-get? risk-events { event-id: event-id })
)

