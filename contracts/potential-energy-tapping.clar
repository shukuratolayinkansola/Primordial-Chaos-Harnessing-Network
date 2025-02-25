;; Potential Energy Tapping Contract

(define-map energy-taps
  { tap-id: uint }
  {
    energy-extracted: uint,
    stability: uint
  }
)

(define-data-var next-tap-id uint u0)

(define-public (create-energy-tap)
  (let
    ((new-id (+ (var-get next-tap-id) u1)))
    (var-set next-tap-id new-id)
    (ok (map-set energy-taps
      { tap-id: new-id }
      {
        energy-extracted: u0,
        stability: u100
      }
    ))
  )
)

(define-public (extract-energy (tap-id uint) (amount uint))
  (let
    ((tap (unwrap! (map-get? energy-taps { tap-id: tap-id }) (err u404))))
    (asserts! (>= (get stability tap) u50) (err u403))
    (ok (map-set energy-taps
      { tap-id: tap-id }
      {
        energy-extracted: (+ (get energy-extracted tap) amount),
        stability: (- (get stability tap) (/ amount u10))
      }
    ))
  )
)

(define-read-only (get-energy-tap (tap-id uint))
  (map-get? energy-taps { tap-id: tap-id })
)

