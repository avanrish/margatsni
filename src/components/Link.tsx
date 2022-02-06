import NextLink from 'next/link';

export default function Link({ children, href, shallow = false, ...props }) {
  return (
    <NextLink href={href} shallow={shallow}>
      <a {...props}>{children}</a>
    </NextLink>
  );
}
