// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import nookies from 'nookies'

export default function logout(ctx: any){
    nookies.destroy(ctx,"jwt")
}
