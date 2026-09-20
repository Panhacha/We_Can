import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real ABA PayWay integration, you would verify the HMAC-SHA512 hash here:
    // const hash = crypto.createHmac('sha512', process.env.ABA_API_KEY).update(body).digest('base64');
    // if (hash !== req.headers.get('x-aba-hash')) throw new Error('Invalid Hash');

    const { tran_id, status } = body;

    if (!tran_id) {
      return NextResponse.json({ error: 'Missing tran_id' }, { status: 400 });
    }

    if (status === 'SUCCESS' || status === 0 || status === 'APPROVED') {
      // 1. Update the Order in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'Verified',
          status: 'Confirmed'
        })
        .eq('id', tran_id);

      if (error) {
        console.error('Supabase Error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }

      console.log(`Order ${tran_id} marked as Paid via Webhook!`);
      return NextResponse.json({ message: 'OK', status: 'Verified' });
    } else {
      // Payment Failed
      await supabase
        .from('orders')
        .update({ payment_status: 'Failed' })
        .eq('id', tran_id);
      
      return NextResponse.json({ message: 'OK', status: 'Failed' });
    }

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}