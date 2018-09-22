# Promoot

Promoot is a ticketing software for event promotion.
It automates ticket issuing with your promoters and provides you with accurate statistics and QR-Code based check-in-system.

- [Get Started](#get-started)
- [Usage](#usage)
- [Configuration](#configuration)
  - [About the templates](#about-the-templates)

## Get Started

To start an instance, pull the Docker Application Package.

```sh
$ docker pull skn0tt/promoot.dockerapp
```

Create your [configuration](#configuration) file:

```sh
$ cat prod.yml

ADMIN_PASSWORD: "root"
TICKET_GROUPS: "5:6:7:8:9"
MERCHANT_NAMES: "SAG:LFS:EMA"
MERCHANT_PASSWORDS: "sag:lfs:ema"
...
```

Start Promoot:

```
$ docker-app render -f prod.yml | docker-compose -f - up -d
```

You can now use Promoot on [localhost](http://localhost).

## Usage

Promoot enables administration of your promoters ticket sales.
These promoters are called *merchants*.

Each *merchant* gets username and password with which he can authenticate himself.

When selling a ticket, he fills out the form at *New Ticket* with the client's data and submits it.

On submit, Promoot sends an email to the client with an attached QR-Code.
When the administrator enables the *Check-In-Phase*, these QR-Codes become activated and can be used for ticket validation at the event check-in.

A bouncer scans the QR-Code with his phone and opens the attached link.
He can then information about this ticket and check it against the client's info.
When the link is opened, Promoot marks the ticket as *checked in*.
This prevents double usage.
The number of checked in tickets is also shown in the statistics.

## Configuration

| Key                   | Description                                                         |
|-----------------------|---------------------------------------------------------------------|
| ADMIN_PASSWORD        | password for the admin                                              |
| TICKET_GROUPS         | ticket groups, delimited by ":"                                     |
| MERCHANT_NAMES        | usernames of the merchants, delimited by ":"                        |
| MERCHANT_PASSWORDS    | passwords of the merchants, in order of usernames, delimited by ":" |
| PORT_HTTP             | TCP port to use (default: 80)                                       |
| SMTP_HOST             | SMTP hostname                                                       |
| SMTP_PORT             | SMTP port                                                           |
| SMTP_PASSWORD         | SMTP password                                                       |
| SMTP_USERNAME         | SMTP username                                                       |
| SMTP_SENDER           | SMTP sender email address                                           |
| TITLE                 | name of the event                                                   |
| MAIL_BODY_TEMPLATE    | template for the email body                                         |
| MAIL_SUBJECT_TEMPLATE | template for the email subject                                      |

### About the Templates

The templates are simple strings with variables that are substituted before using them in the emails.
Basically, wrap the variables in double curly braces (`{{variableName}}`).
The following variables are available:

- `id`
- `firstName`
- `lastName`
- `email`
- `merchant`
- `group`
- `checkedIn`

So, for Bob's Ticket, the template `Your ticket, {{firstName}}:` would become `Your ticket, Bob:`.

For advanced templating, refer to the [Mustache Documentation](https://github.com/janl/mustache.js).
