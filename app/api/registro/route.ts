import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const tipo_clase = formData.get('tipo_clase') as string
    const nombre = formData.get('nombre') as string
    const email = formData.get('email') as string
    const telefono = formData.get('telefono') as string
    const cantidad_personas = parseInt(formData.get('cantidad_personas') as string)
    const monto_total = parseFloat(formData.get('monto_total') as string)
    const bailadora = formData.get('bailadora') as string
    const archivo = formData.get('comprobante') as File

    if (!archivo || archivo.size === 0) {
      return NextResponse.json(
        { error: 'El comprobante de pago es obligatorio.' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Subir archivo a Supabase Storage
    const extension = archivo.name.split('.').pop()
    const timestamp = Date.now()
    const filePath = `${tipo_clase}/${timestamp}.${extension}`

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

    // Insertar registro en la tabla
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
