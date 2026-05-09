import { useEffect, useMemo, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import styled from 'styled-components';
import { InitialOverlay, MouseLiquid, Resume } from '@/components';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

const RESUME_FILENAME = 'BakerC_Resume.pdf';
const SCROLL_IDLE_MS = 600;
const SECTION_GAP = '1.25rem';

const Screen = styled.main`
  position: relative;
  width: 100%;
  min-height: 100%;
  background: ${props => props.theme.colors.black};
`;

const ScrollContainer = styled.div`
  position: fixed;
  inset: 0;
  overflow-y: auto;
  overflow-x: clip;
  background-color: ${props => props.theme.colors.black};
`;

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SECTION_GAP};
`;

const BackgroundLayer = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100vh;
  width: 130vw;
  min-width: 100%;
  z-index: 0;
  opacity: 0.45;
  overflow: hidden;
`;

const ContentLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.xxl};

  @media (max-width: 1400px) {
    padding-top: 0;
  }

  @media (max-width: 480px) {
    padding-top: 0;
  }

  @media (max-width: 600px) {
    padding: 0 ${props => props.theme.spacing.xs} ${props => props.theme.spacing.xs};
  }
`;

const ResumeFrame = styled.div`
  position: relative;
  z-index: 1;
  width: min(900px, 100%);
  margin-top: 100px;
  border: 1px solid ${props => props.theme.colors.theme};
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0 16px 48px color-mix(in srgb, ${props => props.theme.colors.theme} 45%, transparent);
  padding: ${props => props.theme.spacing.lg};

  @media (max-width: 600px) {
    padding: ${props => props.theme.spacing.xs};
  }
`;

const PdfPages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 600px) {
    gap: ${props => props.theme.spacing.xs};
  }
`;

const PdfCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  box-shadow: 0 8px 24px color-mix(in srgb, ${props => props.theme.colors.theme} 40%, transparent);
`;

const LoadingText = styled.p`
  margin: 0;
  padding: ${props => props.theme.spacing.lg};
  font-family: ${props => props.theme.fonts.families.basic};
  color: ${props => props.theme.colors.white};
`;

const ErrorText = styled.p`
  margin: 0;
  padding: ${props => props.theme.spacing.lg};
  font-family: ${props => props.theme.fonts.families.basic};
  color: ${props => props.theme.colors.white};
`;

/* Same placement as <Name />; chrome matches <Resume /> (backdrop blur, white text). */
const HomePageLink = styled.a`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  left: ${props => props.theme.spacing.xxl};
  font-family: ${props => props.theme.fonts.families.block};
  font-weight: 800;
  font-size: ${props => props.theme.fonts.sizes.lg};
  color: ${props => props.theme.colors.white};
  background: none;
  text-decoration: none;
  cursor: pointer;
  z-index: 1000;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.spacing.xs};
  display: inline-block;
  white-space: nowrap;

  &::before,
  &::after {
    content: none;
    display: none;
  }

  @media (max-width: 640px) {
    left: ${props => props.theme.spacing.sm};
    top: ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fonts.sizes.md};
    padding: ${props => props.theme.spacing.xs};
    line-height: 1.2;
  }

  @media (max-width: 400px) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    top: calc(3.5 * ${props => props.theme.spacing.md});
  }
`;

function homePageHref() {
  return (import.meta.env.BASE_URL || '/').replace(/\/{2,}/g, '/');
}

function HomePageNavLink() {
  return <HomePageLink href={homePageHref()}>HomePage</HomePageLink>;
}

export default function ResumePage() {
  const resumeUrl = `${import.meta.env.BASE_URL}${RESUME_FILENAME}`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderTasksRef = useRef<Array<{ cancel: () => void }>>([]);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolling(false), SCROLL_IDLE_MS);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const updateSize = () => {
      const style = getComputedStyle(el);
      const padX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      setFrameWidth(el.clientWidth - padX);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener('resize', updateSize);
    const mq = window.matchMedia('(max-width: 600px)');
    mq.addEventListener('change', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
      mq.removeEventListener('change', updateSize);
    };
  }, []);

  const pageWidth = useMemo(() => {
    if (!frameWidth) return 0;
    return Math.max(320, frameWidth);
  }, [frameWidth]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setPdfError(null);

    const loadingTask = getDocument(resumeUrl);
    loadingTask.promise
      .then((doc) => {
        if (cancelled) {
          void doc.destroy();
          return;
        }
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!cancelled) {
          setPdfError(error instanceof Error ? error.message : 'Failed to load PDF file.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      void loadingTask.destroy();
    };
  }, [resumeUrl]);

  useEffect(() => {
    if (!pdfDoc || !numPages || !pageWidth) return;
    const doc = pdfDoc;
    let cancelled = false;
    renderTasksRef.current.forEach((task) => task.cancel());
    renderTasksRef.current = [];

    async function renderPages() {
      for (let index = 0; index < numPages; index++) {
        if (cancelled) return;
        const canvas = canvasRefs.current[index];
        if (!canvas) continue;

        const page = await doc.getPage(index + 1);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = pageWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
        });
        renderTasksRef.current.push(renderTask);
        await renderTask.promise;
        renderTasksRef.current = renderTasksRef.current.filter((task) => task !== renderTask);
      }
    }

    renderPages().catch((error) => {
      if (!cancelled) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          error.name === 'RenderingCancelledException'
        ) {
          return;
        }
        setPdfError(error instanceof Error ? error.message : 'Failed to render PDF.');
      }
    });

    return () => {
      cancelled = true;
      renderTasksRef.current.forEach((task) => task.cancel());
      renderTasksRef.current = [];
    };
  }, [pdfDoc, numPages, pageWidth]);

  return (
    <Screen>
      <ScrollContainer
        ref={scrollRef}
        className={`scroll-container ${isScrolling ? 'scrolling' : ''}`}
      >
        <HomePageNavLink />
        <Resume downloadPdf />
        <PageWrapper>
          <BackgroundLayer>
            <MouseLiquid
              image="/bg-1.mp4"
              control={{
                options: {
                  emitDensityScale: 9000,
                  emitVelocityScale: 1.4,
                  fadeOutDensityRate: 0.58,
                },
              }}
            />
          </BackgroundLayer>
          <ContentLayer>
            <ResumeFrame ref={frameRef}>
              {isLoading ? <LoadingText>Loading resume...</LoadingText> : null}
              {pdfError ? <ErrorText>{pdfError}</ErrorText> : null}
              <PdfPages>
                {!pdfError &&
                  Array.from({ length: numPages }, (_, index) => (
                    <PdfCanvas
                      key={`resume-page-${index + 1}`}
                      ref={(el) => {
                        canvasRefs.current[index] = el;
                      }}
                    />
                  ))}
              </PdfPages>
            </ResumeFrame>
          </ContentLayer>
        </PageWrapper>
      </ScrollContainer>
      <InitialOverlay />
    </Screen>
  );
}
