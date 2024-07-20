import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './steps/destination-and-date-step';
import { InviteGuestsStep } from './steps/invite-guests-step';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';

export function CreateTripPage() {
  const navigate = useNavigate();

  const [ isGuestsInputOpen, setisGuestsInputOpen ] = useState(false)
  const [ isGuestModalOpen, setIsModalInputOpen ] = useState(false)
  const [ isConfirmTripModalOpen, setIsConfirmTripModalInputOpen ] = useState(false)

  const [ destination, setDestination ] = useState('')
  const [ ownerName, setOwnerName ] = useState('')
  const [ ownerEmail, setOwnerEmail ] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()

  const [ emailsToInvite, setEmailToInvite ] = useState([
    'ecthon@gmail.com'
  ])

  function openGuestsInput () {
    setisGuestsInputOpen(true)
  }

  function closeGuestsInput () {
    setisGuestsInputOpen(false)
  }

  function openConfirmTripModal () {
    setIsConfirmTripModalInputOpen(true)
  }

  function closeConfirmTripModal () {
    setIsConfirmTripModalInputOpen(false)
  }
  
  function openGuestsModal () {
    setIsModalInputOpen(true)
  }

  function closeGuestsModal () {
    setIsModalInputOpen(false)
  }

  function addNewEmailToInvite (event: FormEvent<HTMLFormElement>) {
    // A linha a baixo preveni o comportament padrão do formulário
    // que, após enviar o valor, a página é redirecionda.
    // Usando a função "preventDefault", eu envio o valor (enter/click) e continuo na
    // mesma página podendo adicionar mais emails.
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    // Se o campo de email estiver vazio ("undefined"), é exibido um erro.
    // As linha a baixo são para remover esse erro. Básicamente quer dizer: Se o campo "email"
    // estiver vazio, eu não vou fazer nada "return". 
    if (!email) {
      return
    }

    // Validação para não deixar add um email repetido.
    if (emailsToInvite.includes(email)) {
      return console.log('Email já cadastrado.')
    }

    // Add email no array usando conceito de imutabilidade.
    setEmailToInvite([...emailsToInvite, email])

    // Limpar o campo/input do formulário.
    event.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemmove: string) {
    // criando um novo array de emails
    // Pega todos os emails do array emailsToInvite que sejam diferentes do "emailToRemomove". 
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemmove)
    setEmailToInvite(newEmailList)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!destination) {
      return
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return
    }

    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }

    const payload = {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail,
    }

    const response = await api.post('/trips', payload)
    const { tripId } = response.data
    
    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className='flex flex-col items-center gap-3'>
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className='space-y-4'>
          <DestinationAndDateStep
            openGuestsInput={openGuestsInput}
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            setDestionation={setDestination}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />   
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pelo plann.er você automaticamente concorda <br/>
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
        </p>
      </div>

      {isGuestModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestsModal={closeGuestsModal}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
        />
      )}

    </div>
  )
}