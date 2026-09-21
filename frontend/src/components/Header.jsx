function Header({ analytics = false }) {

  return (

    <header className="header">

      <div>

        <h1 className="header-title">
          Sensor
        </h1>

        <p className="header-subtitle">
          LOCATION
        </p>

      </div>


      {!analytics && (

        <div className="header-date">
          DATE TODAY
        </div>

      )}

    </header>

  );
}

export default Header;