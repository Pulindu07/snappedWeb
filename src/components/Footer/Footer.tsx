const Footer =()=>{
    
    return (
        <footer className="bg-gray-800 text-white py-4 rounded-md">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} PhotoApp. All rights reserved.</p>
        </div>
      </footer>
    );
}

export default Footer;
