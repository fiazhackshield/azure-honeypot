# Azure Honeypot with T-Pot

Live Guide: [https://fiazhacksheild.github.io/azure-honeypot](https://fiazhacksheild.github.io/azure-honeypot)

This project demonstrates how to deploy a T-Pot honeypot on Microsoft Azure, expose it intentionally for research, and analyze real-world attack traffic using built-in dashboards.

## Overview

* Deploy Azure VM and networking for a controlled honeypot lab
* Install T-Pot Community Edition
* Open all inbound traffic intentionally (lab only)
* Observe attacks via Kibana, Grafana, and service dashboards
* Destroy the environment safely when done

## Requirements

* Azure free trial or active subscription
* VM: 4 vCPUs, 16 GB RAM, 256 GB disk
* Linux workstation with SSH and Nmap

## Steps

1. Create resource group and VM in Azure
2. Add high-priority NSG allow-all rule
3. SSH into VM, create non-root user, update system
4. Clone and install T-Pot, reboot
5. Validate services and ports, access dashboards
6. Run external Nmap scans to generate events

## Access

T-Pot portal:

```
https://<vm_public_ip>:64297/
```

## Cleanup

Delete entire lab:

```bash
az group delete --name tpot-rg --yes --no-wait
```

## References

* Azure VMs
* Azure NSGs
* T-Pot CE: [https://github.com/telekom-security/tpotce](https://github.com/telekom-security/tpotce)
* Honeypots overview

Full documentation and screenshots available at:

[https://fiazhacksheild.github.io/azure-honeypot](https://fiazhacksheild.github.io/azure-honeypot)
