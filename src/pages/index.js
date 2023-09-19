import Head from 'next/head'
import Layout from '../components/ui/Layout'
import { Box, Chip, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import ProfessorCard from '@/components/cards/ProfessorCard'
import { useState } from 'react'

export default function Home() {
  const profesores = [
    {
      name: "Jose",
      email: "jorge@uca.edu.ar",
      phone: 12345,
      office: "UCA",
      officeHours: "9-18"
    },
    {
      name: "Luis",
      email: "luis@uca.edu.ar",
      phone: 67890,
      office: "UCA",
      officeHours: "9-18"
    },
    {
      name: "Ana",
      email: "ana@universidad.edu",
      phone: 54321,
      office: "Edificio B",
      officeHours: "10-17"
    },
    {
      name: "David",
      email: "david@colegio.edu",
      phone: 98765,
      office: "Edificio C",
      officeHours: "8-16"
    },
    {
      name: "Sofía",
      email: "sofia@instituto.edu",
      phone: 13579,
      office: "Edificio D, Habitación 203",
      officeHours: "9-15"
    },
    {
      name: "María",
      email: "maria@universidad.edu",
      phone: 24680,
      office: "Edificio E",
      officeHours: "10-16"
    },
    {
      name: "Carlos",
      email: "carlos@colegio.edu",
      phone: 86420,
      office: "Edificio F",
      officeHours: "8-17"
    },
    {
      name: "Laura",
      email: "laura@instituto.edu",
      phone: 11223,
      office: "Edificio G, Habitación 105",
      officeHours: "9-14"
    },
    {
      name: "Pedro",
      email: "pedro@universidad.edu",
      phone: 998877,
      office: "Edificio H",
      officeHours: "11-19"
    },
    {
      name: "Elena",
      email: "elena@colegio.edu",
      phone: 223344,
      office: "Edificio I",
      officeHours: "8-15"
    },
    {
      name: "Juan",
      email: "juan@instituto.edu",
      phone: 554433,
      office: "Edificio J, Habitación 201",
      officeHours: "10-17"
    },
    {
      name: "Isabel",
      email: "isabel@universidad.edu",
      phone: 112233,
      office: "Edificio K",
      officeHours: "9-18"
    },
    {
      name: "Antonio",
      email: "antonio@colegio.edu",
      phone: 334455,
      office: "Edificio L",
      officeHours: "8-16"
    },
    {
      name: "Marta",
      email: "marta@instituto.edu",
      phone: 667788,
      office: "Edificio M, Habitación 104",
      officeHours: "9-15"
    },
    {
      name: "Roberto",
      email: "roberto@universidad.edu",
      phone: 998877,
      office: "Edificio N",
      officeHours: "10-17"
    },
    {
      name: "Carmen",
      email: "carmen@colegio.edu",
      phone: 223344,
      office: "Edificio O",
      officeHours: "8-16"
    },
    {
      name: "Miguel",
      email: "miguel@instituto.edu",
      phone: 554433,
      office: "Edificio P, Habitación 202",
      officeHours: "9-18"
    },
    {
      name: "Raquel",
      email: "raquel@universidad.edu",
      phone: 112233,
      office: "Edificio Q",
      officeHours: "8-15"
    },
    {
      name: "Hugo",
      email: "hugo@colegio.edu",
      phone: 334455,
      office: "Edificio R",
      officeHours: "9-15"
    },
    {
      name: "Natalia",
      email: "natalia@instituto.edu",
      phone: 667788,
      office: "Edificio S, Habitación 103",
      officeHours: "10-17"
    },
    {
      name: "Ricardo",
      email: "ricardo@universidad.edu",
      phone: 998877,
      office: "Edificio T",
      officeHours: "8-16"
    },
    {
      name: "Patricia",
      email: "patricia@colegio.edu",
      phone: 223344,
      office: "Edificio U",
      officeHours: "9-18"
    },
    {
      name: "Fernando",
      email: "fernando@instituto.edu",
      phone: 554433,
      office: "Edificio V, Habitación 204",
      officeHours: "10-17"
    },
    {
      name: "Clara",
      email: "clara@universidad.edu",
      phone: 112233,
      office: "Edificio W",
      officeHours: "8-15"
    },
    {
      name: "Ignacio",
      email: "ignacio@colegio.edu",
      phone: 334455,
      office: "Edificio X",
      officeHours: "9-15"
    },
    {
      name: "Susana",
      email: "susana@instituto.edu",
      phone: 667788,
      office: "Edificio Y, Habitación 102",
      officeHours: "9-18"
    },
    {
      name: "Pablo",
      email: "pablo@universidad.edu",
      phone: 998877,
      office: "Edificio Z",
      officeHours: "8-16"
    }
  ];

  const [officeSelected, setOfficeSelected] = useState([]);

  return (
    <>
      <Head>
        <title>Leherer</title>
        <link
          rel="icon"
          type='image/png'
          href="https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/book-bookmark-icon.png" />
      </Head>
      <Layout>
        <Box sx={{
          display: "flex",
          backgroundColor: "#F5F5F5",
        }}
        >
          <Box sx={{
            flexDirection: "column",
            minWidth: 300,
            minHeight: 300,
            display: "flex",
            borderColor: "black",
            borderWidth: "1pt",
            borderRightStyle: "solid",
            px:1
            // backgroundColor: "red"
          }}>
            <Typography variant="h3" component="div" sx={{ mt: 2, mb: 2, ml: 2 }} color={"black"}>
              Filters
            </Typography>
            <Divider width={"100%"} sx={{ my: 2 }} />
            <FormControl sx={{ ml: 2 }}>
              <InputLabel id="office-select">Office</InputLabel>
              <Select
                multiple
                labelId="office-select"
                value={officeSelected}
                onChange={(event) => setOfficeSelected(event.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {profesores.map((profesor, index) => (
                  <MenuItem key={index} value={profesor.office}>
                    {profesor.office}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", mb: 2, ml: 2 }}>
            {profesores.map((profesor, index) => (
              <ProfessorCard
                key={index}
                name={profesor.name}
                email={profesor.email}
                phone={profesor.phone}
                office={profesor.office}
                officeHours={profesor.officeHours}
                style={{ mr: 3, mt: 2 }}
              />))}
          </Box>
        </Box>
      </Layout>
    </>
  )
}
