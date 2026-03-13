import styled from 'styled-components';

const Section = styled.section`
  width: 100%;
  padding: ${props => props.theme.spacing.xxl} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: ${props => props.theme.spacing.maxWidth};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleButton = styled.button`
  padding: 0;
  margin: 0 auto;
  border: none;
  background: none;
  cursor: pointer;
  text-align: center;
  font-family: ${props => props.theme.fonts.families.block};
  font-size: ${props => props.theme.fonts.sizes.xxxl};
  font-weight: 400;
  line-height: 1;
  color: ${props => props.theme.colors.white};
`;

const FancyTitle = styled.span`
  font-family: ${props => props.theme.fonts.families.fancy};
  font-style: italic;
`;

const CONTACT_SECTION_ID = 'contact';
const CONTACT_EMAIL = 'hello@Charles-D-Baker.com';

function Contact() {
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

  return (
    <Section id={CONTACT_SECTION_ID}>
      <Wrapper>
        <TitleButton type="button" onClick={handleCopyEmail} title={`Copy ${CONTACT_EMAIL}`}>
          <FancyTitle>hello</FancyTitle>{CONTACT_EMAIL.replace('hello', '')}
        </TitleButton>
      </Wrapper>
    </Section>
  );
}

export default Contact;
