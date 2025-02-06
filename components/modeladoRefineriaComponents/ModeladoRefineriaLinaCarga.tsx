"use client";

import React from "react";

function ModeladoRefineriaLinaCarga() {
  return (
    <svg
      width="700"
      height="400"
      viewBox="0 0 700 400"
      style={{ border: "1px solid #ccc" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ====== Definiciones de gradientes y recursos en un solo bloque ====== */}
      <defs>
        {/* Gradiente lineal para la cabina (verde) */}
        <linearGradient id="cabGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8fa" />
          <stop offset="100%" stopColor="#5a8" />
        </linearGradient>

        {/* Gradiente lineal para el tanque (plateado) */}
        <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eee" />
          <stop offset="100%" stopColor="#aaa" />
        </linearGradient>

        {/* Gradiente radial para las ruedas */}
        <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>

      {/* Fondo del área de carga */}
      <rect x="0" y="0" width="700" height="400" fill="#f0f0f0" />

      {/* Título principal */}
      <text
        x="350"
        y="30"
        textAnchor="middle"
        fill="#333"
        fontSize="20"
        fontWeight="bold"
      >
        Área de Carga - Refinería
      </text>

      {/* ============= LÍNEA DE CARGA 1 ============= */}
      <g transform="translate(50, 70)">
        {/* Etiqueta de la línea */}
        <text x="0" y="-10" fill="#333" fontSize="16" fontWeight="bold">
          Cargador 1
        </text>

        {/* Tubería principal vertical */}
        <path d="M 0 0 V 60" stroke="#555" strokeWidth="6" fill="none" />

        {/* Codo horizontal hacia la válvula */}
        <path d="M 0 60 H 40" stroke="#555" strokeWidth="6" fill="none" />

        {/* Válvula (representada como un rectángulo con línea) */}
        <rect
          x="40"
          y="55"
          width="20"
          height="10"
          fill="#999"
          stroke="#333"
          strokeWidth="1"
        />
        {/* Palanca de la válvula */}
        <line x1="50" y1="50" x2="50" y2="40" stroke="#333" strokeWidth="2" />

        {/* Continúa tubería hacia el camión */}
        <path
          d="M 60 60 H 100 V 30"
          stroke="#555"
          strokeWidth="6"
          fill="none"
        />

        {/* Manómetro / Gauge (círculo + texto) */}
        <circle
          cx="0"
          cy="-20"
          r="10"
          fill="#fff"
          stroke="#333"
          strokeWidth="2"
        />
        <text x="0" y="-16" fill="#333" fontSize="8" textAnchor="middle">
          P
        </text>
        <text x="15" y="-15" fill="#333" fontSize="10">
          Presión
        </text>

        {/* Camión cisterna / Gandola */}
        <g transform="translate(85, 20)">
          {/* Cabina */}
          <rect x="0" y="10" width="20" height="15" fill="#666" />
          {/* Tanque */}
          <rect x="20" y="5" width="50" height="25" fill="#aaa" />
          {/* Ruedas */}
          <circle cx="15" cy="30" r="5" fill="#333" />
          <circle cx="55" cy="30" r="5" fill="#333" />
        </g>
      </g>

      {/* ============= LÍNEA DE CARGA 2 ============= */}
      <g transform="translate(50, 170)">
        {/* Etiqueta de la línea */}
        <text x="0" y="-10" fill="#333" fontSize="16" fontWeight="bold">
          Cargador 2
        </text>

        {/* Tubería principal vertical */}
        <path d="M 0 0 V 60" stroke="#555" strokeWidth="6" fill="none" />

        {/* Codo horizontal hacia la válvula */}
        <path d="M 0 60 H 40" stroke="#555" strokeWidth="6" fill="none" />

        {/* Válvula */}
        <rect
          x="40"
          y="55"
          width="20"
          height="10"
          fill="#999"
          stroke="#333"
          strokeWidth="1"
        />
        {/* Palanca de la válvula */}
        <line x1="50" y1="50" x2="50" y2="40" stroke="#333" strokeWidth="2" />

        {/* Continúa tubería hacia el camión */}
        <path
          d="M 60 60 H 100 V 30"
          stroke="#555"
          strokeWidth="6"
          fill="none"
        />

        {/* Manómetro / Gauge (ej. Temperatura) */}
        <circle
          cx="0"
          cy="-20"
          r="10"
          fill="#fff"
          stroke="#333"
          strokeWidth="2"
        />
        <text x="0" y="-16" fill="#333" fontSize="8" textAnchor="middle">
          T
        </text>
        <text x="15" y="-15" fill="#333" fontSize="10">
          Temp
        </text>

        {/* Camión cisterna / Gandola */}
        <g transform="translate(85, 20)">
          {/* Cabina */}
          <rect x="0" y="10" width="20" height="15" fill="#666" />
          {/* Tanque */}
          <rect x="20" y="5" width="50" height="25" fill="#aaa" />
          {/* Ruedas */}
          <circle cx="15" cy="30" r="5" fill="#333" />
          <circle cx="55" cy="30" r="5" fill="#333" />
        </g>
      </g>

      {/* ============= LÍNEA DE CARGA 3 ============= */}
      <g transform="translate(50, 270)">
        {/* Etiqueta de la línea */}
        <text x="0" y="-10" fill="#333" fontSize="16" fontWeight="bold">
          Cargador 3
        </text>

        {/* Tubería principal vertical */}
        <path d="M 0 0 V 60" stroke="#555" strokeWidth="6" fill="none" />

        {/* Codo horizontal hacia la válvula */}
        <path d="M 0 60 H 40" stroke="#555" strokeWidth="6" fill="none" />

        {/* Válvula */}
        <rect
          x="40"
          y="55"
          width="20"
          height="10"
          fill="#999"
          stroke="#333"
          strokeWidth="1"
        />
        {/* Palanca de la válvula */}
        <line x1="50" y1="50" x2="50" y2="40" stroke="#333" strokeWidth="2" />

        {/* Continúa tubería hacia el camión */}
        <path
          d="M 60 60 H 100 V 30"
          stroke="#555"
          strokeWidth="6"
          fill="none"
        />

        {/* Manómetro / Gauge (ej. Flujo) */}
        <circle
          cx="0"
          cy="-20"
          r="10"
          fill="#fff"
          stroke="#333"
          strokeWidth="2"
        />
        <text x="0" y="-16" fill="#333" fontSize="8" textAnchor="middle">
          F
        </text>
        <text x="15" y="-15" fill="#333" fontSize="10">
          Flujo
        </text>

        {/* ============== CAMIÓN CISTERNA 3D (gradientes) ============== */}
        <g transform="translate(30,50)">
          {/* CABINA */}
          <rect
            x="0"
            y="0"
            width="60"
            height="40"
            fill="url(#cabGradient)"
            stroke="#444"
            strokeWidth="1"
            rx="4"
          />
          <rect
            x="8"
            y="5"
            width="25"
            height="15"
            fill="#cceeff"
            stroke="#333"
            strokeWidth="0.5"
            rx="2"
          />
          <polygon
            points="33,0 45,0 45,20 33,20"
            fill="#cceeff"
            stroke="#333"
            strokeWidth="0.5"
          />
          <rect x="55" y="10" width="5" height="20" fill="#666" />
          <circle cx="57" cy="15" r="2" fill="#ffcc00" />
          <circle cx="57" cy="25" r="2" fill="#fff" />

          {/* TANQUE */}
          <rect
            x="60"
            y="-5"
            width="150"
            height="50"
            fill="url(#tankGradient)"
            stroke="#666"
            strokeWidth="1"
            rx="10"
          />
          <ellipse
            cx="60"
            cy="20"
            rx="10"
            ry="25"
            fill="url(#tankGradient)"
            stroke="#666"
            strokeWidth="1"
          />
          <ellipse
            cx="210"
            cy="20"
            rx="10"
            ry="25"
            fill="url(#tankGradient)"
            stroke="#666"
            strokeWidth="1"
          />

          {/* Tapas superiores */}
          <circle cx="80" cy="-5" r="3" fill="#666" />
          <circle cx="100" cy="-5" r="3" fill="#666" />
          <circle cx="120" cy="-5" r="3" fill="#666" />
          <circle cx="140" cy="-5" r="3" fill="#666" />

          {/* Escalera lateral */}
          <line x1="75" y1="5" x2="75" y2="35" stroke="#666" strokeWidth="1" />
          <line x1="75" y1="10" x2="80" y2="10" stroke="#666" strokeWidth="1" />
          <line x1="75" y1="15" x2="80" y2="15" stroke="#666" strokeWidth="1" />
          <line x1="75" y1="20" x2="80" y2="20" stroke="#666" strokeWidth="1" />
          <line x1="75" y1="25" x2="80" y2="25" stroke="#666" strokeWidth="1" />
          <line x1="75" y1="30" x2="80" y2="30" stroke="#666" strokeWidth="1" />

          {/* RUEDAS */}
          {/* Cabina (2 ejes delanteros) */}
          <g transform="translate(15,40)">
            <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
            <circle cx="0" cy="0" r="4" fill="#777" />
          </g>
          <g transform="translate(45,40)">
            <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
            <circle cx="0" cy="0" r="4" fill="#777" />
          </g>

          {/* Tanque (2 ejes traseros + 1 extra) */}
          <g transform="translate(90,40)">
            <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
            <circle cx="0" cy="0" r="4" fill="#777" />
          </g>
          <g transform="translate(120,40)">
            <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
            <circle cx="0" cy="0" r="4" fill="#777" />
          </g>
          <g transform="translate(150,40)">
            <circle cx="0" cy="0" r="8" fill="url(#wheelGradient)" />
            <circle cx="0" cy="0" r="4" fill="#777" />
          </g>
        </g>
      </g>

      {/* ====== Grupo con la figura compleja (paths con coordenadas grandes) ====== */}
      {/* Se aplica una transformación para que sea visible en el viewBox 0..700 x 0..400 */}
      <g transform="translate(200, 80) scale(0.3)">
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M59.705,755.083h-8.331   c-2.165,0-3.921-1.757-3.921-3.921v-5.882c0-2.167,1.756-3.921,3.921-3.921h8.331V755.083z"
        />
        <g>
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M132.377,745.925h-0.165    c0.775,2.681,1.184,5.496,1.162,8.382c5.554,0-2.52,0,8.3,0V652.248c0-2.166-1.756-3.922-3.923-3.922H77.557    c-2.344,0-4.446,1.486-5.227,3.697l-12.524,35.449l-2.981,7.471v60.14h16.451c0.068-2.884,0.327-6.917,1.028-9.7    c2.938-11.759,15.797-20.989,29.308-20.989c13.898,0,25.082,9.352,28.601,21.531H132.377z"
          />
          <g>
            <path
              style={{
                fill: "#FFFFFF",
                stroke: "#646464",
                strokeWidth: 2,
                strokeMiterlimit: 10,
              }}
              d="M126.1,665.94c0-2.165-1.755-3.92-3.92-3.92     
                 H82.837c-2.348,0-4.456,1.481-5.258,3.687l-7.673,21.159c-0.652,1.793,0.675,3.689,2.583,3.689h49.691     
                 c2.166,0,3.92-1.756,3.92-3.923V665.94z"
            />
            <path
              style={{
                fill: "#FFFFFF",
                stroke: "#646464",
                strokeWidth: 2,
                strokeMiterlimit: 10,
              }}
              d="M126.269,697.404     
                 c0,1.781-1.446,3.227-3.229,3.227h-6.457c-1.783,0-3.227-1.445-3.227-3.227c0-1.783,1.444-3.227,3.227-3.227h6.457     
                 C124.823,694.177,126.269,695.621,126.269,697.404z"
            />
            <g>
              <path
                style={{
                  fill: "none",
                  stroke: "#646464",
                  strokeWidth: 2,
                  strokeMiterlimit: 10,
                }}
                d="M67.158,742.789h-1.127      
                   c-2.545,0-4.612-2.068-4.612-4.614l0.038-43.218l11.564-33.252c0.866-2.493,3.223-4.168,5.862-4.168h48.495      
                   c2.543,0,4.613,2.068,4.613,4.611v53.746c0,2.543-2.082,4.611-4.639,4.611H101.53c-12.336,0-24.397,7.661-28.681,18.215      
                   C71.845,741.191,69.611,742.789,67.158,742.789z"
              />
            </g>
          </g>
        </g>
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M51.327,741.373h5.57v-13.102l-1.65-0.002   
             c-2.164-0.006-3.92,1.748-3.92,3.912V741.373z"
        />
        <rect
          x="166.795"
          y="714.506"
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          width="220.371"
          height="9.512"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M393.993,735.332h6.119   
             c2.164,0,3.92,1.756,3.92,3.92v0.805c0,2.166-1.756,3.922-3.92,3.922h-6.119V735.332z"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M395.49,722.256c-26.389,0-233.969,0-253.702,0   
             v32.115c20.553,0,107.751,0,111.664,0c0-0.043-0.003-0.09-0.003-0.133c0-16.447,13.332-29.779,29.776-29.779   
             c15.175,0,29.272,11.533,29.777,29.912h9.616c0-0.043-0.003-0.09-0.003-0.133c0-16.339,13.34-29.779,29.775-29.779   
             c15.151,0,29.26,11.486,29.779,29.95h17.254v-28.233C399.424,724.007,397.66,722.256,395.49,722.256z"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M144.968,687.93   
             c0,15.159,12.29,27.447,27.45,27.447H392.67c15.159,0,27.445-12.288,27.445-27.447V660.31c0-15.159-12.286-27.447-27.445-27.447   
             H172.417c-15.16,0-27.45,12.288-27.45,27.447V687.93z"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M253.609,632.861h-34.583l0,0   
             c0-4.201,3.406-7.607,7.609-7.607H246C250.202,625.254,253.609,628.66,253.609,632.861L253.609,632.861z"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M299.833,632.861h-34.582l0,0   
             c0-4.201,3.405-7.607,7.608-7.607h19.367C296.426,625.254,299.833,628.66,299.833,632.861L299.833,632.861z"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M346.059,632.861h-34.582l0,0   
             c0-4.201,3.405-7.607,7.608-7.607h19.365C342.653,625.254,346.059,628.66,346.059,632.861L346.059,632.861z"
        />
        <path
          style={{
            fill: "#FFFFFF",
            stroke: "#646464",
            strokeWidth: 2,
            strokeMiterlimit: 10,
          }}
          d="M404.265,757.76c0,2.165-1.757,3.92-3.923,3.92   
             h-7.373c-2.166,0-3.921-1.755-3.921-3.92v-6.684c0-2.166,1.755-3.92,3.921-3.92h7.373c2.166,0,3.923,1.754,3.923,3.92V757.76z"
        />
        <g>
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M201.743,760c0,2.164-1.755,3.92-3.921,3.92    
               h-45.901c-2.165,0-3.921-1.756-3.921-3.92v-27.369c0-2.165,1.756-3.92,3.921-3.92h45.901c2.166,0,3.921,1.755,3.921,3.92V760z"
          />
          <g>
            <path
              style={{
                fill: "#FFFFFF",
                stroke: "#646464",
                strokeWidth: 2,
                strokeMiterlimit: 10,
              }}
              d="M190.953,764.387     
                 c0,1.338-1.085,2.421-2.42,2.421c-1.337,0-2.421-1.083-2.421-2.421v-35.62c0-1.336,1.084-2.421,2.421-2.421     
                 c1.335,0,2.42,1.085,2.42,2.421V764.387z"
            />
            <path
              style={{
                fill: "#FFFFFF",
                stroke: "#646464",
                strokeWidth: 2,
                strokeMiterlimit: 10,
              }}
              d="M177.292,764.387     
                 c0,1.338-1.085,2.421-2.419,2.421c-1.338,0-2.422-1.083-2.422-2.421v-35.62c0-1.336,1.084-2.421,2.422-2.421     
                 c1.334,0,2.419,1.085,2.419,2.421V764.387z"
            />
            <path
              style={{
                fill: "#FFFFFF",
                stroke: "#646464",
                strokeWidth: 2,
                strokeMiterlimit: 10,
              }}
              d="M163.632,764.387     
                 c0,1.338-1.085,2.421-2.421,2.421c-1.338,0-2.421-1.083-2.421-2.421v-35.62c0-1.336,1.083-2.421,2.421-2.421     
                 c1.336,0,2.421,1.085,2.421,2.421V764.387z"
            />
          </g>
        </g>
        <line
          style={{
            fill: "none",
            stroke: "#646464",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
          x1="357.298"
          y1="632.861"
          x2="357.298"
          y2="685.586"
        />
        <line
          style={{
            fill: "none",
            stroke: "#646464",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
          x1="381.224"
          y1="633.063"
          x2="381.224"
          y2="685.787"
        />
        <line
          style={{
            fill: "none",
            stroke: "#646464",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
          x1="357.741"
          y1="644.824"
          x2="380.337"
          y2="644.824"
        />
        <line
          style={{
            fill: "none",
            stroke: "#646464",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
          x1="357.741"
          y1="660.109"
          x2="380.337"
          y2="660.109"
        />
        <line
          style={{
            fill: "none",
            stroke: "#646464",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
          x1="357.741"
          y1="675.396"
          x2="380.337"
          y2="675.396"
        />
        <g>
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M128.505,754.172    
               c0,14.082-11.414,25.496-25.495,25.496c-14.083,0-25.498-11.414-25.498-25.496c0-14.081,11.415-25.498,25.498-25.498    
               C117.092,728.674,128.505,740.091,128.505,754.172z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M120.295,754.172    
               c0,9.547-7.739,17.284-17.285,17.284c-9.547,0-17.287-7.737-17.287-17.284c0-9.547,7.74-17.286,17.287-17.286    
               C112.556,736.886,120.295,744.625,120.295,754.172z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M116.938,754.172    
               c0,7.691-6.236,13.928-13.927,13.928c-7.692,0-13.929-6.236-13.929-13.928c0-7.692,6.237-13.927,13.929-13.927    
               C110.702,740.245,116.938,746.479,116.938,754.172z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M111.06,754.172    
               c0,4.447-3.604,8.05-8.049,8.05c-4.447,0-8.052-3.603-8.052-8.05c0-4.446,3.604-8.051,8.052-8.051    
               C107.455,746.121,111.06,749.726,111.06,754.172z"
          />
        </g>
        <g>
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M308.785,754.418    
               c0,14.082-11.413,25.498-25.494,25.498c-14.083,0-25.499-11.416-25.499-25.498c0-14.08,11.415-25.496,25.499-25.496    
               C297.372,728.922,308.785,740.338,308.785,754.418z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M300.575,754.418    
               c0,9.547-7.738,17.285-17.284,17.285c-9.547,0-17.288-7.738-17.288-17.285c0-9.547,7.74-17.285,17.288-17.285    
               C292.836,737.133,300.575,744.871,300.575,754.418z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M297.217,754.418    
               c0,7.692-6.236,13.928-13.926,13.928c-7.692,0-13.929-6.235-13.929-13.928c0-7.691,6.237-13.926,13.929-13.926    
               C290.981,740.492,297.217,746.727,297.217,754.418z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M291.339,754.418    
               c0,4.447-3.604,8.051-8.049,8.051c-4.447,0-8.052-3.604-8.052-8.051c0-4.445,3.604-8.05,8.052-8.05    
               C287.735,746.368,291.339,749.973,291.339,754.418z"
          />
        </g>
        <g>
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M378.042,754.418    
               c0,14.082-11.414,25.498-25.495,25.498c-14.083,0-25.498-11.416-25.498-25.498c0-14.08,11.415-25.496,25.498-25.496    
               C366.629,728.922,378.042,740.338,378.042,754.418z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M369.832,754.418    
               c0,9.547-7.739,17.285-17.285,17.285c-9.547,0-17.287-7.738-17.287-17.285c0-9.547,7.74-17.285,17.287-17.285    
               C362.094,737.133,369.832,744.871,369.832,754.418z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M366.474,754.418    
               c0,7.692-6.235,13.928-13.926,13.928c-7.692,0-13.929-6.235-13.929-13.928c0-7.691,6.237-13.926,13.929-13.926    
               C360.239,740.492,366.474,746.727,366.474,754.418z"
          />
          <path
            style={{
              fill: "#FFFFFF",
              stroke: "#646464",
              strokeWidth: 2,
              strokeMiterlimit: 10,
            }}
            d="M360.597,754.418    
               c0,4.447-3.605,8.051-8.049,8.051c-4.447,0-8.051-3.604-8.051-8.051c0-4.445,3.605-8.05,8.051-8.05    
               C356.993,746.368,360.597,749.973,360.597,754.418z"
          />
        </g>
      </g>

      {/* Leyenda de estados (opcional) */}
      <g transform="translate(600, 60)">
        <circle cx="0" cy="0" r="10" fill="#00ff00" />
        <text x="20" y="5" fontSize="12" fill="#333">
          Activo
        </text>

        <circle cx="0" cy="40" r="10" fill="#ff0000" />
        <text x="20" y="45" fontSize="12" fill="#333">
          Inactivo
        </text>
      </g>
    </svg>
  );
}

export default ModeladoRefineriaLinaCarga;
