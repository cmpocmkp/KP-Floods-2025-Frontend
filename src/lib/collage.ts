export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&auto=format&fit=crop&w=1600&h=900";

export type Tile = { src: string; alt: string; credit: string; href?: string };

export const COLLAGE_TILES: Tile[] = [
  // ---- Wikimedia Commons (hotlink-safe direct file redirects) ----
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Flood%20in%20Pakistan%202022.png",
    alt: "Aerial view of flooded settlements in Pakistan",
    credit: "Ali Hyder Junejo / Wikimedia",
    href: "https://commons.wikimedia.org/wiki/File:Flood_in_Pakistan_2022.png"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Indus%20River%20under%20flood%202010.jpg",
    alt: "Indus River during floods",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Indus_River_under_flood_2010.jpg"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Indus%20River%20under%20flood.jpg",
    alt: "Indus River in flood",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Indus_River_under_flood.jpg"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/ISS-36%20Indus%20Valley%20in%20Pakistan%20(2).jpg",
    alt: "ISS view of Indus Valley",
    credit: "NASA / Wikimedia",
    href: "https://commons.wikimedia.org/wiki/File:ISS-36_Indus_Valley_in_Pakistan_(2).jpg"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/In%20Search%20of%20Hope.jpg",
    alt: "People moving through flood water",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:In_Search_of_Hope.jpg"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/U.S.%20Marines%20Augment%20Pakistan%20Flood%20Relief%20Efforts%20in%20Sindh%20Province%20DVIDS329543.jpg",
    alt: "Relief efforts in Sindh",
    credit: "DVIDS / Wikimedia",
    href: "https://commons.wikimedia.org/wiki/Category:Floods_in_Sindh"
  },
  {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/U.S.%20Marines%20Provide%20Food%20to%20Flood%20Victims%20in%20the%20Sindh%20Province%20DVIDS328643.jpg",
    alt: "Food distribution during floods",
    credit: "DVIDS / Wikimedia",
    href: "https://commons.wikimedia.org/wiki/Category:Floods_in_Sindh"
  },

  // ---- Unsplash (royalty-free; high-availability) ----
  { src: "https://images.unsplash.com/photo-1558478551-1a378f63328e?q=80&auto=format&fit=crop&w=1600&h=900", alt: "Raging brown floodwater in a town", credit: "Unsplash" },
  { src: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&auto=format&fit=crop&w=1600&h=900", alt: "Submerged street during monsoon", credit: "Unsplash" },
  { src: "https://images.unsplash.com/photo-1508182311256-e3f7d50b57b0?q=80&auto=format&fit=crop&w=1600&h=900", alt: "River in spate", credit: "Unsplash" },
  { src: "https://images.unsplash.com/photo-1501676491270-805c876b67e2?q=80&auto=format&fit=crop&w=1600&h=900", alt: "Swollen river sweeping debris", credit: "Unsplash" },
  { src: "https://images.unsplash.com/photo-1623053047069-08d11c949015?q=80&auto=format&fit=crop&w=1600&h=900", alt: "Flooded roadway and vehicles", credit: "Unsplash" }
];