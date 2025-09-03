export const fmtPKR = (n: number) =>
  new Intl.NumberFormat("en-PK", { 
    style: "currency", 
    currency: "PKR", 
    maximumFractionDigits: 2 
  }).format(n);

export const fmtDatePK = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { 
    timeZone: "Asia/Karachi", 
    dateStyle: "medium" 
  }).format(new Date(iso));

export const fmtDatePKFull = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { 
    timeZone: "Asia/Karachi", 
    dateStyle: "full" 
  }).format(new Date(iso)); 