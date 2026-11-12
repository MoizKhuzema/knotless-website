/**
 * Digital business cards — /card/<slug>/.
 *
 * One entry per person. The page, the QR on the back of the card and the
 * "Save contact" vCard (/card/<slug>.vcf) are all built from this list.
 *
 * Every card carries the published support line, not a personal number:
 * SITE.supportPhone, so a change to that number reaches the cards too.
 *
 * QR: `qr` is the module grid of https://knotless.com.au/card/<slug>/ (QR
 * version 3, error correction M), drawn as one SVG path in a size×size box.
 * It is precomputed so the site needs no QR dependency. To add a person or
 * change a URL, regenerate it — e.g. with Python's `segno`:
 *   segno.make('https://knotless.com.au/card/<slug>/', error='m').matrix
 * and turn each run of dark modules into `M x y h w v1 h-w z`.
 */
import { SITE } from '../config/site';

export interface Card {
  slug: string;
  name: string;
  givenName: string;
  familyName: string;
  title: string;
  email: string;
  phone: string;
  qr: { size: number; path: string };
}

export const CARDS: Card[] = [
  {
    slug: 'insiya',
    name: 'Insiya Karbalai',
    givenName: 'Insiya',
    familyName: 'Karbalai',
    title: 'Client Advisory',
    email: 'insiya.karbalai@knotless.com.au',
    phone: SITE.supportPhone,
    qr: { size: 29, path: 'M0 0h7v1h-7zM8 0h1v1h-1zM11 0h7v1h-7zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h3v1h-3zM13 1h2v1h-2zM16 1h1v1h-1zM19 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h2v1h-2zM11 2h1v1h-1zM13 2h1v1h-1zM19 2h1v1h-1zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h1v1h-1zM11 3h1v1h-1zM14 3h5v1h-5zM20 3h1v1h-1zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h2v1h-2zM11 4h1v1h-1zM13 4h2v1h-2zM18 4h2v1h-2zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM13 5h2v1h-2zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM9 7h4v1h-4zM14 7h1v1h-1zM0 8h1v1h-1zM3 8h7v1h-7zM13 8h5v1h-5zM21 8h1v1h-1zM24 8h1v1h-1zM26 8h3v1h-3zM2 9h2v1h-2zM5 9h1v1h-1zM10 9h1v1h-1zM14 9h2v1h-2zM18 9h3v1h-3zM23 9h2v1h-2zM26 9h2v1h-2zM5 10h2v1h-2zM11 10h2v1h-2zM14 10h3v1h-3zM18 10h1v1h-1zM22 10h3v1h-3zM26 10h1v1h-1zM0 11h3v1h-3zM4 11h2v1h-2zM7 11h2v1h-2zM11 11h1v1h-1zM14 11h1v1h-1zM16 11h2v1h-2zM20 11h1v1h-1zM22 11h1v1h-1zM24 11h2v1h-2zM28 11h1v1h-1zM1 12h1v1h-1zM3 12h2v1h-2zM6 12h3v1h-3zM10 12h1v1h-1zM12 12h3v1h-3zM20 12h1v1h-1zM22 12h1v1h-1zM28 12h1v1h-1zM0 13h1v1h-1zM4 13h1v1h-1zM9 13h4v1h-4zM15 13h2v1h-2zM18 13h1v1h-1zM22 13h7v1h-7zM1 14h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM11 14h1v1h-1zM14 14h2v1h-2zM18 14h3v1h-3zM22 14h2v1h-2zM26 14h1v1h-1zM28 14h1v1h-1zM0 15h2v1h-2zM4 15h1v1h-1zM7 15h2v1h-2zM11 15h4v1h-4zM16 15h1v1h-1zM19 15h1v1h-1zM21 15h3v1h-3zM26 15h1v1h-1zM28 15h1v1h-1zM2 16h2v1h-2zM6 16h1v1h-1zM10 16h1v1h-1zM19 16h2v1h-2zM23 16h1v1h-1zM25 16h1v1h-1zM0 17h3v1h-3zM5 17h1v1h-1zM8 17h2v1h-2zM11 17h2v1h-2zM15 17h1v1h-1zM17 17h1v1h-1zM19 17h3v1h-3zM24 17h1v1h-1zM26 17h2v1h-2zM0 18h2v1h-2zM3 18h2v1h-2zM6 18h1v1h-1zM8 18h4v1h-4zM13 18h3v1h-3zM18 18h2v1h-2zM21 18h3v1h-3zM25 18h1v1h-1zM28 18h1v1h-1zM0 19h2v1h-2zM3 19h1v1h-1zM5 19h1v1h-1zM8 19h1v1h-1zM10 19h1v1h-1zM12 19h2v1h-2zM15 19h1v1h-1zM18 19h1v1h-1zM20 19h4v1h-4zM25 19h2v1h-2zM0 20h3v1h-3zM4 20h5v1h-5zM13 20h1v1h-1zM15 20h1v1h-1zM17 20h1v1h-1zM19 20h9v1h-9zM8 21h4v1h-4zM13 21h1v1h-1zM15 21h1v1h-1zM18 21h1v1h-1zM20 21h1v1h-1zM24 21h2v1h-2zM0 22h7v1h-7zM8 22h2v1h-2zM13 22h1v1h-1zM15 22h1v1h-1zM17 22h1v1h-1zM19 22h2v1h-2zM22 22h1v1h-1zM24 22h2v1h-2zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM10 23h4v1h-4zM15 23h1v1h-1zM17 23h4v1h-4zM24 23h1v1h-1zM28 23h1v1h-1zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM8 24h1v1h-1zM10 24h2v1h-2zM13 24h1v1h-1zM16 24h1v1h-1zM18 24h8v1h-8zM28 24h1v1h-1zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM8 25h1v1h-1zM10 25h1v1h-1zM14 25h6v1h-6zM21 25h1v1h-1zM28 25h1v1h-1zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM10 26h1v1h-1zM14 26h2v1h-2zM17 26h1v1h-1zM20 26h1v1h-1zM23 26h2v1h-2zM26 26h3v1h-3zM0 27h1v1h-1zM6 27h1v1h-1zM10 27h1v1h-1zM13 27h1v1h-1zM16 27h1v1h-1zM22 27h2v1h-2zM25 27h2v1h-2zM28 27h1v1h-1zM0 28h7v1h-7zM8 28h2v1h-2zM11 28h1v1h-1zM13 28h2v1h-2zM20 28h1v1h-1zM22 28h2v1h-2z' },
  },
  {
    slug: 'huzefa',
    name: 'Huzefa Karbalai',
    givenName: 'Huzefa',
    familyName: 'Karbalai',
    title: 'Business Consultant',
    email: 'huzefa.karbalai@knotless.com.au',
    phone: SITE.supportPhone,
    qr: { size: 29, path: 'M0 0h7v1h-7zM9 0h1v1h-1zM15 0h1v1h-1zM19 0h2v1h-2zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM10 1h2v1h-2zM15 1h2v1h-2zM20 1h1v1h-1zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h4v1h-4zM16 2h1v1h-1zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h3v1h-3zM17 3h2v1h-2zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h2v1h-2zM13 4h1v1h-1zM17 4h4v1h-4zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM12 5h6v1h-6zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM8 7h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM19 7h2v1h-2zM0 8h1v1h-1zM2 8h5v1h-5zM12 8h1v1h-1zM14 8h2v1h-2zM17 8h1v1h-1zM19 8h1v1h-1zM22 8h5v1h-5zM0 9h2v1h-2zM4 9h1v1h-1zM7 9h2v1h-2zM10 9h2v1h-2zM16 9h1v1h-1zM18 9h2v1h-2zM21 9h4v1h-4zM28 9h1v1h-1zM2 10h1v1h-1zM6 10h3v1h-3zM12 10h1v1h-1zM15 10h1v1h-1zM17 10h2v1h-2zM20 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM0 11h1v1h-1zM8 11h1v1h-1zM10 11h1v1h-1zM14 11h1v1h-1zM16 11h1v1h-1zM20 11h2v1h-2zM23 11h3v1h-3zM27 11h1v1h-1zM0 12h1v1h-1zM2 12h5v1h-5zM8 12h2v1h-2zM11 12h1v1h-1zM15 12h1v1h-1zM17 12h1v1h-1zM19 12h1v1h-1zM23 12h1v1h-1zM25 12h2v1h-2zM2 13h1v1h-1zM4 13h1v1h-1zM9 13h1v1h-1zM13 13h2v1h-2zM16 13h1v1h-1zM18 13h7v1h-7zM28 13h1v1h-1zM0 14h8v1h-8zM11 14h1v1h-1zM13 14h4v1h-4zM18 14h1v1h-1zM20 14h1v1h-1zM23 14h1v1h-1zM25 14h2v1h-2zM1 15h2v1h-2zM7 15h1v1h-1zM10 15h1v1h-1zM12 15h2v1h-2zM15 15h2v1h-2zM19 15h2v1h-2zM23 15h1v1h-1zM27 15h1v1h-1zM2 16h3v1h-3zM6 16h1v1h-1zM9 16h3v1h-3zM14 16h2v1h-2zM17 16h1v1h-1zM19 16h1v1h-1zM25 16h2v1h-2zM0 17h2v1h-2zM3 17h3v1h-3zM7 17h2v1h-2zM10 17h2v1h-2zM16 17h1v1h-1zM19 17h2v1h-2zM22 17h3v1h-3zM26 17h1v1h-1zM28 17h1v1h-1zM0 18h1v1h-1zM2 18h1v1h-1zM5 18h2v1h-2zM8 18h1v1h-1zM12 18h1v1h-1zM15 18h1v1h-1zM17 18h2v1h-2zM20 18h2v1h-2zM26 18h1v1h-1zM0 19h1v1h-1zM4 19h1v1h-1zM7 19h3v1h-3zM11 19h2v1h-2zM14 19h1v1h-1zM18 19h2v1h-2zM22 19h2v1h-2zM27 19h1v1h-1zM0 20h1v1h-1zM3 20h1v1h-1zM6 20h2v1h-2zM9 20h1v1h-1zM12 20h1v1h-1zM16 20h2v1h-2zM20 20h5v1h-5zM26 20h3v1h-3zM8 21h2v1h-2zM11 21h4v1h-4zM16 21h1v1h-1zM18 21h1v1h-1zM20 21h1v1h-1zM24 21h5v1h-5zM0 22h7v1h-7zM9 22h1v1h-1zM11 22h1v1h-1zM13 22h4v1h-4zM19 22h2v1h-2zM22 22h1v1h-1zM24 22h3v1h-3zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h3v1h-3zM12 23h2v1h-2zM15 23h2v1h-2zM18 23h3v1h-3zM24 23h1v1h-1zM27 23h1v1h-1zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM8 24h2v1h-2zM14 24h5v1h-5zM20 24h5v1h-5zM26 24h1v1h-1zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM8 25h1v1h-1zM11 25h1v1h-1zM16 25h3v1h-3zM20 25h1v1h-1zM25 25h4v1h-4zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM8 26h6v1h-6zM15 26h1v1h-1zM17 26h1v1h-1zM19 26h2v1h-2zM22 26h6v1h-6zM0 27h1v1h-1zM6 27h1v1h-1zM10 27h1v1h-1zM14 27h2v1h-2zM20 27h2v1h-2zM23 27h1v1h-1zM25 27h1v1h-1zM27 27h1v1h-1zM0 28h7v1h-7zM8 28h3v1h-3zM12 28h1v1h-1zM14 28h1v1h-1zM17 28h1v1h-1zM22 28h1v1h-1zM26 28h1v1h-1z' },
  },
];

/** "+61 432 197 553" → "+61432197553" for tel: links and the vCard. */
export const dial = (p: string) => p.replace(/[^\d+]/g, '');
