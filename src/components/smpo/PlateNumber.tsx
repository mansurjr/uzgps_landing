/* Replica of smn-web/src/shared/components/PlateNumber.vue (types 1 and 3) — same font, borders and flag */

export type Plate =
  | { type: 1; region: string; numbers: string; symbols: string } // legal entity: 01 | 714 UZA
  | { type: 3; region: string; letter: string; numbers: string; symbols: string }; // individual: 01 | A 714 UZ

export default function PlateNumber({ plate }: { plate: Plate }) {
  return (
    <span
      className="relative flex w-[135px] items-center justify-between rounded-[5px] border-[3px] border-black bg-white"
      style={{ fontFamily: "SmpoNumber, sans-serif", zoom: 0.8 }}
    >
      <span className="mr-1 px-1 py-px text-[20px] leading-[1.1] text-black">{plate.region}</span>
      <span className="absolute left-[22px] top-[-3px] h-[calc(100%+4px)] w-[2px] bg-black" />
      {plate.type === 3 && <span className="relative top-px mr-1 text-[30px] leading-[0.7] text-black">{plate.letter}</span>}
      <span className="relative top-px mr-1 text-[30px] leading-[0.7] text-black">{plate.numbers}</span>
      <span className="relative top-px mr-1 text-[30px] leading-[0.7] text-black">{plate.symbols}</span>
      <span className="flex flex-col items-center pr-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static svg */}
        <img src="/smpo/flag.svg" alt="" className="mb-1 block max-h-[10px] max-w-[14px]" />
        <span className="text-center text-[14px] leading-[0.65] text-[#02a0e3]">uz</span>
      </span>
    </span>
  );
}
