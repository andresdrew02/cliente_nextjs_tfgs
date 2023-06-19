export function createSlug(str: string) {
    // Reemplaza los caracteres especiales y espacios por "-"
    str = str.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '-');
    return str;
  }