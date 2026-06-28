import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { MovingBg } from '@/components';

const Section = styled.section`
  position: relative;
  width: 100%;
  padding: ${props => props.theme.spacing.xxl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const BgContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: ${props => props.theme.spacing.maxWidth};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xxl};
  margin-top: ${props => props.theme.spacing.xxl};
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: ${props => props.theme.spacing.md};
    margin-top: ${props => props.theme.spacing.xl};
  }
`;

const TitleButton = styled.button`
  position: relative;
  padding: ${props => props.theme.spacing.sm};
  margin: 0 auto;
  border: none;
  background: none;
  cursor: pointer;
  text-align: center;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: 800;
  line-height: 1.15;
  color: ${props => props.theme.colors.white};
  max-width: 100%;
  word-break: keep-all;
  overflow-wrap: normal;

  @media (max-width: 640px) {
    font-size: clamp(0.9rem, 3.8vw, 1.35rem);
    padding: ${props => props.theme.spacing.md};
    min-height: 44px;
  }
`;

const EmailPart = styled.span`
  white-space: nowrap;
`;

const FancyTitle = styled.span`
  font-family: ${props => props.theme.fonts.families.fancy};
  font-style: italic;
`;

const Tooltip = styled.span<{ $visible: boolean; $x: number; $y: number }>`
  position: fixed;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  transform: translate(12px, 16px);
  z-index: 9999;
  pointer-events: none;
  padding: 6px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.families.basic};
  font-size: ${props => props.theme.fonts.sizes.xs};
  font-weight: 500;
  white-space: pre-line;
  text-align: center;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 160ms ease;
`;

const CONTACT_SECTION_ID = 'contact';
const CONTACT_EMAIL = 'cdbaker.dev@gmail.com';
const CONTACT_EMAIL_AT_INDEX = CONTACT_EMAIL.indexOf('@');
const CONTACT_EMAIL_LOCAL = CONTACT_EMAIL.slice(0, CONTACT_EMAIL_AT_INDEX);
const CONTACT_EMAIL_DOMAIN = CONTACT_EMAIL.slice(CONTACT_EMAIL_AT_INDEX);
const CONTACT_EMAIL_FANCY_PREFIX = 'cdbaker';
const CONTACT_EMAIL_LOCAL_REST = CONTACT_EMAIL_LOCAL.slice(CONTACT_EMAIL_FANCY_PREFIX.length);

function Contact() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = CONTACT_EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setTooltipPos({ x: event.clientX, y: event.clientY });
  }, []);

  return (
    <Section id={CONTACT_SECTION_ID}>
      <BgContainer>
        <MovingBg image="/bg-1.mp4" overlays={{ top: true }} />
      </BgContainer>
      <Wrapper>
        <TitleButton
          type="button"
          onClick={handleCopyEmail}
          aria-label={`Copy email ${CONTACT_EMAIL}`}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onMouseMove={handleMouseMove}
          onFocus={() => setTooltipVisible(true)}
          onBlur={() => setTooltipVisible(false)}
        >
          <EmailPart>
            <FancyTitle>{CONTACT_EMAIL_FANCY_PREFIX}</FancyTitle>{CONTACT_EMAIL_LOCAL_REST}
          </EmailPart>
          <wbr />
          <EmailPart>{CONTACT_EMAIL_DOMAIN}</EmailPart>
        </TitleButton>
      </Wrapper>
      <Tooltip
        role="tooltip"
        aria-hidden={!tooltipVisible}
        $visible={tooltipVisible}
        $x={tooltipPos.x}
        $y={tooltipPos.y}
      >
        Click to Copy
      </Tooltip>
    </Section>
  );
}

export default Contact;
