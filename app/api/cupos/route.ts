import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CAPACIDAD = 50

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
      .select('tipo_clase, cantidad_personas')
      .in('estado', ['pendiente', 'confirmado'])

    if (error) throw error

    const ocupados: Record<string, number> = {
      'clase-1': 0,
      'clase-2': 0,
    }

    for (const row of data ?? []) {
      if (row.tipo_clase in ocupados) {
        ocupados[row.tipo_clase] += row.cantidad_personas ?? 1
      }
    }

    return NextResponse.json({
      'clase-1': { ocupados: ocupados['clase-1'], capacidad: CAPACIDAD },
      'clase-2': { ocupados: ocupados['clase-2'], capacidad: CAPACIDAD },
    })
  } catch {
    return NextResponse.json(
      { error: 'No se pudo obtener disponibilidad' },
      { status: 500 }
    )
  }
}
