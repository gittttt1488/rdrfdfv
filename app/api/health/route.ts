import {database} from '../../../lib/server';
export const dynamic='force-dynamic';
export async function GET(){try{const d=database();await d.prepare('SELECT id FROM users LIMIT 1').first();await d.prepare('SELECT id FROM coin_transactions LIMIT 1').first();return Response.json({status:'ready',database:'connected',authentication:'ChatGPT',ai:'procedural'},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({status:'database-unavailable'},{status:503})}}
