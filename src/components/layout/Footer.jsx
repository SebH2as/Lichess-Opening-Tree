const Footer = () => {
    const footYear = new Date().getFullYear()
  return (
    <footer className='footer p-10 bg-neutral text-neutral-content footer-center'>
        SideProject - {footYear}
    </footer>
  )
}

export default Footer