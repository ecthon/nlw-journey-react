import { ArrowRight, MapPin, Calendar, UserRoundPlus, Settings2 } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';

export function CreateTripPage() {
  const navigate = useNavigate();

  const [ isGuestInputOpen, setIsGuestInputOpen ] = useState(false)
  const [ isGuestModalOpen, setIsModalInputOpen ] = useState(false)
  const [ isConfirmTripModalOpen, setIsConfirmTripModalInputOpen ] = useState(false)
  const [ emailsToInvite, setEmailToInvite ] = useState([
    'ecthon@gmail.com'
  ])

  function openGuestsInput () {
    setIsGuestInputOpen(true)
  }

  function closeGuestsInput () {
    setIsGuestInputOpen(false)
  }

  function openConfirmTripModal () {
    setIsConfirmTripModalInputOpen(true)
  }

  function closeConfirmTripModal () {
    setIsConfirmTripModalInputOpen(false)
  }
  
  function openGuestModal () {
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

  function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/trips/123')
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className='flex flex-col items-center gap-3'>
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className='space-y-4'>
          <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className='flex items-center gap-2 flex-1'>
              <MapPin className='size-5 text-zinc-400'/>
              <input disabled={isGuestInputOpen} type="text" placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='size-5 text-zinc-400'/>
              <input disabled={isGuestInputOpen} type="text" placeholder="Quando?" className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none" />
            </div>

            <div className='w-px h-6 bg-zinc-800'/>

            {isGuestInputOpen
              ?
                <button onClick={closeGuestsInput} className='bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700'>
                  Alterar local/data
                  <Settings2 className='size-5'/> 
                </button>
              : 
                (
                  <button onClick={openGuestsInput} className='bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400'>
                  Continuar
                  <ArrowRight className='size-5'/>
                </button>
                )
            }
          </div>

          {isGuestInputOpen
            &&
            (
              <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
                <button type='button' onClick={openGuestModal} className='flex items-center gap-2 flex-1 text-left'>
                  <UserRoundPlus className='size-5 text-zinc-400'/>
                  {emailsToInvite.length > 0 
                    ? <span className='text-zinc-100 text-lg flex-1'>{emailsToInvite.length} pessoa(s) convidada(s)</span>
                    : <span className='text-zinc-400 text-lg flex-1'>Quem estará na viagem?</span>
                  }
                </button>

                <div className='w-px h-6 bg-zinc-800'/>

                <button onClick={openConfirmTripModal} className='bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400'>
                  Confirmar viagem
                  <ArrowRight className='size-5'/>
                </button>
              </div>
            )
          }
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
        />
      )}

    </div>
  )
}