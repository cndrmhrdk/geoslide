import { lazy, Suspense } from 'react';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';

const LandslideModel3D = lazy(() => import('../components/LandSlideModel3d'));

export default function EdukasiModel3D() {
  return (
    <>
      <PageHeader
        badge="Edukasi"
        title="Bagaimana Longsor Terjadi?"
        subtitle="Putar penampang lereng, naikkan hujan, lalu lihat apa yang terjadi."
        icon="bi-layers"
      />
      <Section bg="subtle" py="md">
        <Suspense fallback={<p>Memuat model 3D...</p>}>
          <LandslideModel3D />
        </Suspense>
      </Section>
    </>
  );
}