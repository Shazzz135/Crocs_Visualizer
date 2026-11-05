// High-precision vector paths and hole coordinates extracted directly
// from official top-down Classic Crocs footwear reference.

export interface LocalHole {
  id: string;
  x: number;
  y: number;
}

// 13 authentic vent holes on Left Shoe (local coordinate space: 0 0 432 966)
export const LEFT_HOLES_LOCAL: LocalHole[] = [
  { id: 'HL-01', x: 263, y: 73 },
  { id: 'HL-02', x: 184, y: 105 },
  { id: 'HL-03', x: 326, y: 136 },
  { id: 'HL-04', x: 260, y: 153 },
  { id: 'HL-05', x: 126, y: 166 },
  { id: 'HL-06', x: 196, y: 182 },
  { id: 'HL-07', x: 329, y: 219 },
  { id: 'HL-08', x: 94, y: 244 },
  { id: 'HL-09', x: 256, y: 247 },
  { id: 'HL-10', x: 160, y: 250 },
  { id: 'HL-11', x: 203, y: 302 },
  { id: 'HL-12', x: 325, y: 302 },
  { id: 'HL-13', x: 92, y: 328 },
];

// 13 authentic vent holes on Right Shoe (local coordinate space: 0 0 432 966)
export const RIGHT_HOLES_LOCAL: LocalHole[] = [
  { id: 'HR-01', x: 186, y: 67 },
  { id: 'HR-02', x: 265, y: 101 },
  { id: 'HR-03', x: 125, y: 132 },
  { id: 'HR-04', x: 191, y: 147 },
  { id: 'HR-05', x: 322, y: 164 },
  { id: 'HR-06', x: 254, y: 177 },
  { id: 'HR-07', x: 124, y: 215 },
  { id: 'HR-08', x: 355, y: 238 },
  { id: 'HR-09', x: 195, y: 241 },
  { id: 'HR-10', x: 290, y: 245 },
  { id: 'HR-11', x: 127, y: 296 },
  { id: 'HR-12', x: 246, y: 296 },
  { id: 'HR-13', x: 356, y: 324 },
];

// Exact outer silhouette of Left Shoe
export const LEFT_OUTER_PATH =
  'M 218,966 L 187,964 L 166,958 L 135,942 L 124,931 L 110,915 L 90,879 L 58,830 L 52,825 L 32,777 L 20,729 L 16,634 L 32,595 L 32,588 L 34,586 L 36,575 L 28,523 L 12,447 L 8,414 L 8,364 L 0,331 L 0,286 L 22,194 L 42,147 L 46,146 L 49,138 L 60,132 L 58,128 L 62,123 L 80,108 L 82,100 L 90,92 L 91,96 L 92,94 L 90,90 L 93,88 L 98,90 L 100,81 L 103,82 L 108,78 L 107,76 L 110,76 L 114,68 L 125,64 L 132,56 L 136,52 L 138,54 L 138,52 L 155,42 L 158,38 L 212,14 L 267,0 L 309,0 L 340,8 L 363,20 L 394,55 L 414,99 L 424,195 L 424,287 L 408,439 L 410,443 L 406,471 L 406,534 L 422,543 L 430,567 L 430,715 L 422,758 L 410,791 L 412,794 L 409,798 L 408,796 L 410,800 L 406,804 L 406,799 L 402,806 L 402,815 L 398,821 L 400,822 L 396,823 L 400,826 L 390,829 L 392,836 L 382,843 L 382,848 L 380,846 L 382,852 L 380,856 L 379,850 L 376,855 L 376,865 L 374,860 L 370,863 L 374,865 L 370,866 L 372,871 L 366,872 L 362,885 L 354,888 L 356,894 L 338,917 L 317,938 L 281,956 L 249,964 L 218,966 Z';

// Exact outer silhouette of Right Shoe
export const RIGHT_OUTER_PATH =
  'M 206,966 L 165,966 L 132,958 L 97,938 L 76,919 L 54,886 L 24,822 L 18,815 L 10,783 L 6,755 L 2,745 L 0,715 L 0,588 L 22,546 L 24,533 L 28,532 L 26,528 L 24,530 L 28,520 L 26,444 L 20,424 L 12,310 L 12,192 L 20,127 L 38,79 L 40,84 L 52,63 L 58,60 L 54,56 L 56,52 L 61,52 L 68,44 L 68,48 L 70,46 L 73,40 L 74,44 L 76,42 L 76,34 L 85,32 L 84,29 L 90,28 L 95,20 L 109,12 L 134,2 L 159,0 L 179,0 L 222,6 L 252,16 L 292,36 L 339,72 L 378,114 L 402,154 L 420,203 L 432,269 L 432,302 L 424,363 L 422,394 L 398,506 L 390,556 L 390,577 L 388,579 L 391,584 L 402,584 L 410,598 L 408,652 L 400,715 L 392,745 L 386,752 L 390,754 L 386,756 L 378,779 L 376,779 L 370,799 L 366,803 L 366,808 L 356,817 L 358,824 L 352,829 L 345,844 L 344,838 L 340,849 L 340,852 L 342,849 L 340,855 L 338,852 L 336,855 L 340,861 L 335,860 L 332,872 L 329,870 L 330,873 L 327,872 L 325,878 L 322,877 L 326,886 L 323,884 L 323,888 L 320,884 L 318,889 L 321,888 L 322,892 L 321,890 L 312,901 L 312,904 L 300,921 L 294,924 L 296,925 L 292,930 L 282,940 L 248,956 L 232,962 L 206,966 Z';

// Collar openings (where the foot enters)
export const LEFT_COLLAR_PATH =
  'M 216,450 C 140,450 100,530 90,640 C 80,750 110,870 216,870 C 322,870 352,750 342,640 C 332,530 292,450 216,450 Z';

export const RIGHT_COLLAR_PATH =
  'M 216,450 C 292,450 332,530 342,640 C 352,750 322,870 216,870 C 110,870 80,750 90,640 C 100,530 140,450 216,450 Z';

// Heel backstraps
export const LEFT_STRAP_PATH =
  'M 34,588 C 20,700 35,930 216,950 C 397,930 412,700 398,598 C 404,602 386,880 216,910 C 46,880 28,602 34,588 Z';

export const RIGHT_STRAP_PATH =
  'M 398,588 C 412,700 397,930 216,950 C 35,930 20,700 34,598 C 28,602 46,880 216,910 C 386,880 404,602 398,588 Z';

// Dimensions per size tier reflecting real-world length-to-width ratios:
// Infant: 250px wide x 320px high (Ratio: 1.28:1 - very stubby, chubby, wide bean!)
// Kids: 240px wide x 410px high (Ratio: 1.71:1)
// Youth: 260px wide x 500px high (Ratio: 1.92:1)
// Adult: 290px wide x 600px high (Ratio: 2.07:1 - classic elongated adult foot shape)
export const SHOE_DISPLAY_SIZES = {
  infant: { width: 250, height: 320, label: 'Infant / Toddler (Stubby & Wide)' },
  kids: { width: 240, height: 410, label: 'Kids (Transitional)' },
  youth: { width: 265, height: 500, label: 'Youth (Streamlined)' },
  adult: { width: 290, height: 600, label: 'Adult (Classic 1:1)' },
} as const;
