import React from "react";
import { SOPHeader } from "@/types/sop";
import { RenderList } from "../../shared/RenderList";
import { formatIndonesianDate } from "@/lib/utils";

interface SOPHeaderSectionProps {
  header: SOPHeader;
}

export function SOPHeaderSection({ header }: SOPHeaderSectionProps) {
  return (
    <div className="sop-header-force-black">
      {/* IDENTITY BOX */}
      <div className="border-[1.5px] border-[#000]">
        <div className="grid grid-cols-[1.1fr_0.8fr] divide-x-[1.5px] divide-[#000]">
          <div className="p-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kemenag-512.png"
              alt="Logo Kemenag"
              className="w-16 object-contain"
            />
            <div className="flex flex-col items-center text-center overflow-hidden">
              <h1 className="text-[9pt] font-black leading-[1.1] uppercase whitespace-nowrap tracking-tighter">
                Kementerian Agama Republik Indonesia
              </h1>
              <h2 className="text-[8pt] font-black leading-[1.1] uppercase whitespace-nowrap tracking-tighter">
                Kantor Kementerian Agama Kabupaten Barito Utara
              </h2>
              <p className="text-[7pt] font-semibold leading-tight mt-0.5 whitespace-nowrap">
                Jalan Ahmad Yani Nomor 28 Muara Teweh 73611
              </p>
              <p className="text-[6.5pt] font-medium leading-tight whitespace-nowrap">
                Telepon/Faximili (0519) 21269, 21047, 21772, 21894
              </p>
              <p className="text-[6pt] font-medium leading-tight whitespace-nowrap">
                e-mail: kemenagbaritoutara@gmail.com & website:
                https://kemenag-baritoutara.com
              </p>
            </div>
          </div>
          <div className="divide-y-[1px] divide-[#000] flex flex-col">
            <div className="p-2 text-[7.5pt] grid grid-cols-[25mm_1fr] gap-x-1 gap-y-0.5 flex-1 text-black leading-tight">
              <span className="font-bold uppercase">NOMOR SOP</span>
              <span>: {header.nomor}</span>
              <span className="font-bold uppercase">TGL. PEMBUATAN</span>
              <span>: {formatIndonesianDate(header.tglBuat)}</span>
              <span className="font-bold uppercase">TGL. REVISI</span>
              <span>: {formatIndonesianDate(header.tglRevisi)}</span>
              <span className="font-bold uppercase">TGL. EFEKTIF</span>
              <span>: {formatIndonesianDate(header.tglEfektif)}</span>
              <span className="font-bold uppercase">DISAHKAN OLEH</span>
              <div className="flex flex-col">
                <span className="leading-tight">: {header.disahkanOleh}</span>
                <div className="flex flex-col items-start mt-6 pl-2">
                  <span className="text-[9pt] mb-7 ml-11 text-black">$</span>
                  <span className="text-[8pt] font-bold leading-tight">
                    {header.pejabatNama}
                  </span>
                  <span className="text-[7pt] font-bold mt-1">
                    NIP. {header.pejabatNip}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFO BOXES */}
      <div className="border-[1px] border-[#000] border-t-0">
        <div className="p-1.5 text-center border-b-[1px] border-[#000] bg-slate-50/50">
          <h3 className="text-[11pt] font-black uppercase tracking-wide">
            {header.namaSOP}
          </h3>
        </div>

        <div className="grid grid-cols-2 divide-x-[1px] divide-[#000] border-b-[1px] border-[#000]">
          <div className="p-1.5 min-h-[40px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Dasar Hukum:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.dasarHukum} />
            </div>
          </div>
          <div className="p-1.5 min-h-[40px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Kualifikasi Pelaksana:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.kualifikasi} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x-[1px] divide-[#000] border-b-[1px] border-[#000]">
          <div className="p-1.5 min-h-[35px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Keterkaitan:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.keterkaitan} />
            </div>
          </div>
          <div className="p-1.5 min-h-[35px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Peralatan / Perlengkapan:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.peralatan} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x-[1px] divide-[#000]">
          <div className="p-1.5 min-h-[35px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Peringatan:
            </h4>
            <div className="text-[8.5pt] text-red-600 leading-tight font-medium text-justify">
              <RenderList
                text={header.peringatan}
                itemClassName="text-red-600"
              />
            </div>
          </div>
          <div className="p-1.5 min-h-[35px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Pencatatan dan Pendataan:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.pencatatan} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
