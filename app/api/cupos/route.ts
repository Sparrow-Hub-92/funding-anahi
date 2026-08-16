import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CAPACIDAD = 50
const MAX_POR_BAILARINA = 10

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('registros_clase')
      .select('tipo_clase, cantidad_personas, bailadora')
      .in('estado', ['pendiente', 'confirmado'])

    if (error) throw error

    const ocupados: Record<string, number> = { 'clase-1': 0, 'clase-2': 0 }
    // cupos por bailarina: { 'clase-1': { 'Silvia Quishpe — Danna': 3, ... }, 'clase-2': { ... } }
    const porBailarina: Record<string, Record<string, number>> = {
      'clase-1': {},
      'clase-2': {},
    }

    for (const row of data ?? []) {
      const tc = row.tipo_clase as string
      const qty = row.cantidad_personas ?? 1
      const bail = row.bailadora as string | null

      if (tc in ocupados) {
        ocupados[tc] += qty
      }
      if (tc in porBailarina && bail) {
        porBailarina[tc][bail] = (porBailarina[tc][bail] ?? 0) + qty
      }
    }

    return NextResponse.json({
      'clase-1': {
        ocupados: ocupados['clase-1'],
        capacidad: CAPACIDAD,
        maxPorBailarina: MAX_POR_BAILARINA,
        cuposBailarina: porBailarina['clase-1'],
      },
      'clase-2': {
        ocupados: ocupados['clase-2'],
        capacidad: CAPACIDAD,
        maxPorBailarina: MAX_POR_BAILARINA,
        cuposBailarina: porBailarina['clase-2'],
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'No se pudo obtener disponibilidad' },
      { status: 500 }
    )
  }
}
