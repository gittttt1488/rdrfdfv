import {handle,ApiError} from '../../../lib/server';
export const dynamic='force-dynamic';
async function api(req:Request){try{return Response.json(await handle(req),{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}catch(e){return Response.json({error:e instanceof ApiError?e.message:'The game could not save. Please try again.',...(process.env.NODE_ENV==='development'?{detail:String(e)}:{})},{status:e instanceof ApiError?e.status:500,headers:{'Cache-Control':'no-store'}});}}
export const GET=api;export const POST=api;
