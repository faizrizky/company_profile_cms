'use client'

import 'leaflet/dist/leaflet.css'

import { useField } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import type { Map as LeafletMap, Marker } from 'leaflet'
import { useEffect, useRef, useState } from 'react'

import { useAdminText } from './useAdminText'

/** Falah HQ, Jakarta — where the map opens before a pin is set. */
const FALLBACK: [number, number] = [-6.2444, 106.8295]

const round = (n: number) => Math.round(n * 1e6) / 1e6

/**
 * Indonesian addresses (RT/RW, "No.", Kel./Kec., postcodes…) confuse the
 * geocoders, so try cleaned-up variants from most to least specific.
 */
function queryVariants(text: string): string[] {
  const parts = text
    .split(',')
    .map((part) =>
      part
        .replace(/\b(No|Nomor|Kav|Blok)\.?\s*[\w/-]+/gi, '')
        .replace(/\bKel(urahan)?\.?(?=\s|$)/gi, '')
        .replace(/\bKec(amatan)?\.?\s*/gi, '')
        .replace(/\bKota(\s+Adm(inistrasi)?\.?)?\s+/gi, '')
        .replace(/Daerah Khusus Ibukota\s*/gi, '')
        .replace(/\bPrpt\.?/gi, 'Prapatan')
        .replace(/\b\d{5}\b/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((part) => part && !/^(RT|RW)\b/i.test(part))
  const variants = [
    text,
    parts.join(', '),
    parts.slice(0, 3).join(', '),
    parts.length > 1 ? `${parts[0]}, ${parts[parts.length - 1]}` : '',
    parts[0] ?? '',
    parts[0]?.replace(/^(Jl|Jln|Jalan)\.?\s+/i, '') ?? '',
    parts.slice(1).join(', '),
  ]
  return [...new Set(variants.map((v) => v.trim()).filter((v) => v.length > 2))]
}

type LatLng = { lat: number; lng: number }

/** Photon handles loose text well; Nominatim is the fallback. Both are OpenStreetMap. */
async function geocode(query: string): Promise<LatLng | null> {
  const q = encodeURIComponent(query)
  try {
    const res = await fetch(`https://photon.komoot.io/api/?limit=1&bbox=94,-11.5,141.5,6.5&q=${q}`)
    const [hit] = ((await res.json()) as { features?: { geometry: { coordinates: [number, number] } }[] }).features ?? []
    if (hit) return { lat: hit.geometry.coordinates[1], lng: hit.geometry.coordinates[0] }
  } catch {
    // try the next service
  }
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=id&q=${q}`, {
      headers: { Accept: 'application/json' },
    })
    const [hit] = (await res.json()) as { lat: string; lon: string }[]
    return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null
  } catch {
    return null
  }
}

const TEXT = {
  en: {
    label: 'Location on the map',
    placeholder: 'Search an address / building…',
    search: 'Search',
    useAddress: 'Use the address above',
    searching: 'Searching…',
    notFound: 'Address not found. Try a shorter one, then click the map to adjust.',
    moved: 'Pin moved. Drag it if it is not quite right.',
    failed: 'Search failed. Click directly on the map.',
    pin: (lat: number, lng: number) => `Pin: ${lat}, ${lng}. Click the map or drag the pin to change it.`,
    empty: 'Click the map to drop the office pin. Without a pin, the website map uses the address text.',
  },
  id: {
    label: 'Lokasi di peta',
    placeholder: 'Cari alamat / nama gedung…',
    search: 'Cari',
    useAddress: 'Pakai alamat di atas',
    searching: 'Mencari…',
    notFound: 'Alamat tidak ditemukan. Coba lebih singkat, lalu klik peta untuk menyesuaikan.',
    moved: 'Pin dipindah. Geser pin bila belum pas.',
    failed: 'Gagal mencari alamat. Klik langsung di peta.',
    pin: (lat: number, lng: number) => `Pin: ${lat}, ${lng}. Klik peta atau geser pin untuk mengubah.`,
    empty: 'Klik peta untuk menaruh pin lokasi kantor. Tanpa pin, peta di website memakai alamat teks.',
  },
}

/**
 * Pick the office location on a map: click to drop the pin, drag it to fine
 * tune, or search an address. Writes the sibling `latitude` / `longitude`
 * fields that the website uses for the Google Maps pin.
 */
export const MapPicker: UIFieldClientComponent = ({ path }) => {
  const base = path.split('.').slice(0, -1).join('.')
  const at = (name: string) => (base ? `${base}.${name}` : name)
  const lat = useField<number | null>({ path: at('latitude') })
  const lng = useField<number | null>({ path: at('longitude') })
  const address = useField<string>({ path: at('address') })
  const t = useAdminText(TEXT)

  const box = useRef<HTMLDivElement>(null)
  const map = useRef<LeafletMap | null>(null)
  const marker = useRef<Marker | null>(null)
  const setters = useRef({ lat: lat.setValue, lng: lng.setValue })
  useEffect(() => {
    setters.current = { lat: lat.setValue, lng: lng.setValue }
  })

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const hasPin = typeof lat.value === 'number' && typeof lng.value === 'number'

  // Create the map once (Leaflet touches `window`, so it loads client-side).
  useEffect(() => {
    let cancelled = false
    void import('leaflet').then((L) => {
      if (cancelled || !box.current || map.current) return
      const start: [number, number] = hasPin ? [lat.value!, lng.value!] : FALLBACK
      const m = L.map(box.current, { scrollWheelZoom: false }).setView(start, hasPin ? 17 : 12)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(m)
      const icon = L.divIcon({ className: 'falah-map-pin', html: '<span></span>', iconSize: [30, 42], iconAnchor: [15, 42] })
      const place = (latlng: { lat: number; lng: number }) => {
        setters.current.lat(round(latlng.lat))
        setters.current.lng(round(latlng.lng))
        if (marker.current) marker.current.setLatLng(latlng)
        else {
          marker.current = L.marker(latlng, { icon, draggable: true }).addTo(m)
          marker.current.on('dragend', () => place(marker.current!.getLatLng()))
        }
      }
      if (hasPin) place({ lat: lat.value!, lng: lng.value! })
      m.on('click', (e) => place(e.latlng))
      map.current = m
      ;(m as LeafletMap & { falahPlace?: typeof place }).falahPlace = place
    })
    return () => {
      cancelled = true
      map.current?.remove()
      map.current = null
      marker.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set up once; later changes go through `place`
  }, [])

  const search = async (text: string) => {
    if (!text.trim()) return
    setStatus(t.searching)
    try {
      let latlng: LatLng | null = null
      for (const variant of queryVariants(text)) {
        latlng = await geocode(variant)
        if (latlng) break
      }
      if (!latlng) return setStatus(t.notFound)
      const m = map.current as (LeafletMap & { falahPlace?: (p: LatLng) => void }) | null
      m?.falahPlace?.(latlng)
      m?.setView(latlng, 17)
      setStatus(t.moved)
    } catch {
      setStatus(t.failed)
    }
  }

  return (
    <div className="field-type falah-map-picker">
      <label className="field-label">{t.label}</label>
      <div className="falah-map-picker__search">
        <input
          type="text"
          value={query}
          placeholder={t.placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void search(query)
            }
          }}
        />
        <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => void search(query)}>
          {t.search}
        </button>
        {address.value ? (
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            onClick={() => {
              setQuery(address.value)
              void search(address.value)
            }}
          >
            {t.useAddress}
          </button>
        ) : null}
      </div>
      <div ref={box} className="falah-map-picker__map" />
      <p className="field-description">
        {status ??
          (hasPin
            ? t.pin(lat.value!, lng.value!)
            : t.empty)}
      </p>
    </div>
  )
}
