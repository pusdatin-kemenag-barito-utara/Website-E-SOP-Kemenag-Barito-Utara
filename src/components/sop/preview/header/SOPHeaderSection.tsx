import React from "react";
import { SOPHeader } from "@/types/sop";
import { RenderList } from "../../shared/RenderList";

interface SOPHeaderSectionProps {
  header: SOPHeader;
}

export function SOPHeaderSection({ header }: SOPHeaderSectionProps) {
  return (
    <div className="sop-header-force-black">
      {/* IDENTITY BOX */}
      <div className="border-[1px] border-[#000]">
        <div className="grid grid-cols-[1fr_1fr] divide-x-[1px] divide-[#000]">
          <div className="p-2 flex flex-col items-center justify-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kemenag-512.png"
              alt="Logo Kemenag"
              className="w-16 mb-2 object-contain"
            />
            <h1 className="text-[14pt] font-black leading-[1.1] uppercase tracking-tight">
              Kementerian Agama
            </h1>
            <h2 className="text-[12pt] font-black leading-[1.1] uppercase tracking-tight">
              Kantor Kabupaten Barito Utara
            </h2>
            <p className="text-[9pt] font-bold leading-normal mt-1 max-w-[400px]">
              Jl. Ahmad Yani No.126 Muara Teweh
            </p>
          </div>
          <div className="divide-y-[1px] divide-[#000]">
            <div className="p-2 text-[9pt] grid grid-cols-[35mm_1fr] gap-1 flex-1 text-black leading-tight">
              <span className="font-bold">NOMOR SOP</span>
              <span>: {header.nomor}</span>
              <span className="font-bold">TGL. PEMBUATAN</span>
              <span>: {header.tglBuat}</span>
              <span className="font-bold">TGL. REVISI</span>
              <span>: {header.tglRevisi || "-"}</span>
              <span className="font-bold">TGL. EFEKTIF</span>
              <span>: {header.tglEfektif}</span>
              <span className="font-bold">DISAHKAN OLEH</span>
              <div className="flex flex-col">
                <span>: {header.disahkanOleh}</span>
                <div className="mt-1 flex flex-col items-center pr-8">
                  <span className="text-[10pt] my-6 text-black">$</span>
                  <span className="font-black underline underline-offset-4">
                    {header.pejabatNama}
                  </span>
                  <span className="text-[8pt]">NIP. {header.pejabatNip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INFO BOXES */}
      <div className="border-[1px] border-[#000] border-t-0">
        <div className="p-2 text-center border-b-[1px] border-[#000] bg-slate-50/50">
          <h3 className="text-[12pt] font-black uppercase tracking-wide">
            {header.namaSOP}
          </h3>
        </div>

        <div className="grid grid-cols-2 divide-x-[1px] divide-[#000] border-b-[1px] border-[#000]">
          <div className="p-2 min-h-[50px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Dasar Hukum:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.dasarHukum} />
            </div>
          </div>
          <div className="p-2 min-h-[50px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Kualifikasi Pelaksana:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.kualifikasi} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x-[1px] divide-[#000] border-b-[1px] border-[#000]">
          <div className="p-2 min-h-[40px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Keterkaitan:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.keterkaitan} />
            </div>
          </div>
          <div className="p-2 min-h-[40px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Peralatan / Perlengkapan:
            </h4>
            <div className="text-[8.5pt] leading-tight text-justify">
              <RenderList text={header.peralatan} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x-[1px] divide-[#000]">
          <div className="p-2 min-h-[40px]">
            <h4 className="text-[9pt] font-black mb-1.5 uppercase underline decoration-1 underline-offset-2">
              Peringatan:
            </h4>
            <div className="text-[8.5pt] italic text-black leading-tight font-medium text-justify">
              <RenderList text={header.peringatan} />
            </div>
          </div>
          <div className="p-2 min-h-[40px]">
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
