import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const MAX_CUPOS_POR_BAILARINA = 10
const CAPACIDAD_TOTAL = 50

function getSupabase() {
  // Server-side only: uses service_role key to bypass RLS.
  // This key is never exposed to the client (no NEXT_PUBLIC_ prefix).
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const tipo_clase = (formData.get('tipo_clase') as string)?.trim()
    const nombre = (formData.get('nombre') as string)?.trim()
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const telefono = (formData.get('telefono') as string)?.trim()
    const cantidad_personas = parseInt(formData.get('cantidad_personas') as string)
    const monto_total = parseFloat(formData.get('monto_total') as string)
    const bailadora = (formData.get('bailadora') as string)?.trim()
    const archivo = formData.get('comprobante') as File

    // ── Validaciones básicas ──────────────────────────────
    if (!tipo_clase || !['clase-1', 'clase-2'].includes(tipo_clase)) {
      return NextResponse.json({ error: 'Tipo de clase no válido.' }, { status: 400 })
    }
    if (!nombre || nombre.length < 2) {
      return NextResponse.json({ error: 'El nombre es obligatorio.' }, { status: 400 })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'El correo electrónico no es válido.' }, { status: 400 })
    }
    if (!bailadora) {
      return NextResponse.json({ error: 'Debes seleccionar una bailarina.' }, { status: 400 })
    }
    if (isNaN(cantidad_personas) || cantidad_personas < 1 || cantidad_personas > MAX_CUPOS_POR_BAILARINA) {
      return NextResponse.json({ error: `La cantidad debe ser entre 1 y ${MAX_CUPOS_POR_BAILARINA}.` }, { status: 400 })
    }
    if (!archivo || archivo.size === 0) {
      return NextResponse.json({ error: 'El comprobante de pago es obligatorio.' }, { status: 400 })
    }
    if (archivo.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'El comprobante no puede superar los 10 MB.' }, { status: 400 })
    }

    const supabase = getSupabase()

    // ── Verificar capacidad total del taller ──────────────
    const { data: totalData, error: totalErr } = await supabase
      .from('registros_clase')
      .select('cantidad_personas')
      .eq('tipo_clase', tipo_clase)
      .in('estado', ['pendiente', 'confirmado'])

    if (totalErr) throw totalErr

    const totalOcupados = totalData.reduce((sum, r) => sum + (r.cantidad_personas ?? 1), 0)
    if (totalOcupados + cantidad_personas > CAPACIDAD_TOTAL) {
      const libres = Math.max(CAPACIDAD_TOTAL - totalOcupados, 0)
      return NextResponse.json(
        { error: libres === 0 ? 'Este taller ya está agotado.' : `Solo quedan ${libres} cupo${libres > 1 ? 's' : ''} disponibles en este taller.` },
        { status: 409 }
      )
    }

    // ── Verificar cupos por bailarina (máx 10) ────────────
    const { data: bailarinaData, error: bailarinaErr } = await supabase
      .from('registros_clase')
      .select('cantidad_personas')
      .eq('tipo_clase', tipo_clase)
      .eq('bailadora', bailadora)
      .in('estado', ['pendiente', 'confirmado'])

    if (bailarinaErr) throw bailarinaErr

    const cuposBailarina = bailarinaData.reduce((sum, r) => sum + (r.cantidad_personas ?? 1), 0)
    if (cuposBailarina + cantidad_personas > MAX_CUPOS_POR_BAILARINA) {
      const restantes = Math.max(MAX_CUPOS_POR_BAILARINA - cuposBailarina, 0)
      return NextResponse.json(
        {
          error: restantes === 0
            ? `Los cupos para ${bailadora} están agotados.`
            : `Solo quedan ${restantes} cupo${restantes > 1 ? 's' : ''} para ${bailadora}.`
        },
        { status: 409 }
      )
    }

    // ── Subir comprobante a Supabase Storage ──────────────
    const extension = archivo.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const timestamp = Date.now()
    const filePath = `${tipo_clase}/${timestamp}_${nombre.replace(/\s+/g, '_')}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('comprobantes')
      .upload(filePath, archivo, {
        contentType: archivo.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error al subir comprobante:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir el comprobante. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from('comprobantes')
      .getPublicUrl(filePath)

    const comprobante_url = urlData.publicUrl

    // ── Insertar registro ─────────────────────────────────
    const { data, error } = await supabase
      .from('registros_clase')
      .insert([
        {
          tipo_clase,
          nombre,
          email,
          telefono,
          cantidad_personas,
          monto_total,
          bailadora,
          comprobante_url,
          estado: 'pendiente',
        },
      ])
      .select()

    if (error) {
      console.error('Error al guardar registro:', error)
      return NextResponse.json(
        { error: 'Error al guardar tu registro. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Error inesperado:', err)
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado.' },
      { status: 500 }
    )
  }
}
