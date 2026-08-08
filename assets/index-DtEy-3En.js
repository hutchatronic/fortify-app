(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){if(e===`external`)return{kind:`external`};let[t,n]=e.split(`:`);if(t===`window`&&n!==void 0){let e=Number(n);return Number.isInteger(e)?{kind:`window`,index:e}:null}return t===`pot`&&n!==void 0&&n!==``?{kind:`pot`,potId:n}:null}function t(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function n(e){let t=e.lastIndexOf(`::`);return t===-1?null:{generatorId:e.slice(0,t),date:e.slice(t+2)}}function r(e,t){let n={...e,...t};for(let[e,r]of Object.entries(t))r===void 0&&delete n[e];return n}function i(e,t,n){return e.find(e=>e.date===t)===void 0?[...e,r({date:t},n)]:e.map(e=>e.date===t?r(e,n):e)}function a(e,t,n){switch(e.kind){case`recurring`:return{...e,overrides:i(e.overrides??[],t,n)};case`irregular`:return{...e,dates:e.dates.map(e=>e.date===t?r(e,n):e)};case`one-off`:return r(e,n)}}function o(e,t,r){let i=n(t);return i===null||!e.generators.some(e=>e.id===i.generatorId)?e:{...e,generators:e.generators.map(e=>e.id===i.generatorId?a(e,i.date,r):e)}}function s(t,n,r){let i=e(r);return i===null?t:o(t,n,{fundedFrom:i})}function c(e,t,n){let r=n.trim();if(r===``)return o(e,t,{amount:void 0});let i=Number(r);return!Number.isFinite(i)||i<0?e:o(e,t,{amount:i})}function l(e,t,n,r){return o(e,t,{paid:n,paidOn:n?r:void 0})}function u(e,n,r){let i=String(n),a={...e.livingEstimates},o=t(r);return o===null?delete a[i]:a[i]=o,{...e,livingEstimates:a}}function d(e,n,r,i){let a=String(n),o=t(i),s={...e.potContributions[a]??{}};o===null||o===0?delete s[r]:s[r]=o;let c={...e.potContributions};return Object.keys(s).length===0?delete c[a]:c[a]=s,{...e,potContributions:c}}function f(e){return String(e).padStart(2,`0`)}function p(e){return`${e.getUTCFullYear()}-${f(e.getUTCMonth()+1)}-${f(e.getUTCDate())}`}function m(e=new Date){return`${e.getFullYear()}-${f(e.getMonth()+1)}-${f(e.getDate())}`}function h(e){let[t,n,r]=e.split(`-`).map(Number);if(t===void 0||n===void 0||r===void 0)throw Error(`Invalid ISO date: "${e}"`);return new Date(Date.UTC(t,n-1,r))}function g(e,t){let n=h(e);return n.setUTCDate(n.getUTCDate()+t),p(n)}function _(e,t,n){return e>=t&&e<=n}var v=864e5;function y(e,t){return Math.round((h(t).getTime()-h(e).getTime())/v)}function ee(e,t){let n=h(e),r=n.getUTCDate(),i=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+t,1)),a=new Date(Date.UTC(i.getUTCFullYear(),i.getUTCMonth()+1,0)).getUTCDate();return i.setUTCDate(Math.min(r,a)),p(i)}function te(e,t,n,r,i){return e.filter(e=>e.entryType===t&&n.includes(e.status)&&_(e.date,r,i)).reduce((e,t)=>e+t.amount,0)}function ne(e,t,n,r){return e.filter(e=>e.entryType===`income`&&t.includes(e.status)&&e.date>n&&e.date<=r).reduce((e,t)=>e+t.amount,0)}function re(e){return e.paidOn??e.date}function ie(e,t,n,r){return e.filter(e=>e.entryType===`expense`&&t.includes(e.status)&&re(e)>r&&n(e)).reduce((e,t)=>e+t.amount,0)}function ae(e,t,n){return te(e,`income`,[`confirmed`,`expected`],t,n)-te(e,`expense`,[`confirmed`,`expected`],t,n)}function oe(e,t,n,r,i){let a=ne(t,[`received`,`confirmed`],e.asOfDateTime,n),o=ie(t,[`received`,`confirmed`],i,e.asOfDateTime);return e.amount+a-o-r}function se(e,t,n,r,i){let a=oe(e,t,n,r,i),o=ne(t,[`expected`],e.asOfDateTime,n),s=ie(t,[`expected`],i,e.asOfDateTime);return a+o-s}function ce(e,t){return y(e.asOfDateTime.slice(0,10),t)}function le(e){let{balance:t,entries:n,cycleStart:r,horizon:i,safetyBuffer:a,today:o,isOutstandingHere:s,potContributions:c}=e,l=n.filter(e=>e.status===`expected`&&_(e.date,o,i)).length,u=e=>e-c;return{plan:ae(n,r,i)-c,conservative:t===null?null:u(oe(t,n,i,a,s)),expected:t===null?null:u(se(t,n,i,a,s)),hasBalance:t!==null,balanceAgeDays:t===null?null:ce(t,o),unconfirmedCount:l,nextAnchorDate:i,safetyBuffer:a,potsIncluded:!1,potContributions:c}}var ue={weekly:7,fortnightly:14,"four-weekly":28};function b(e,t,n){return t===`monthly`?ee(e,n):g(e,ue[t]*n)}function de(e,t,n,r){let i=[];for(let a=0;a<r;a+=1){let r=n+a,o=b(e,t,r),s=b(e,t,r+1);i.push({index:r,start:o,end:g(s,-1)})}return i}function x(e,t,n){if(n!==`monthly`)return Math.floor(y(t,e)/ue[n]);let r=h(t),i=h(e),a=(i.getUTCFullYear()-r.getUTCFullYear())*12+(i.getUTCMonth()-r.getUTCMonth());for(;e<b(t,n,a);)--a;for(;e>=b(t,n,a+1);)a+=1;return a}function fe(e,t,n){return e.fundedFrom??{kind:`window`,index:x(e.date,t,n)}}function pe(e,t){return e.kind===`window`&&e.index===t}function me(e,t,n){return e.kind===`external`?`Paid elsewhere`:e.kind===`pot`?t.find(t=>t.id===e.potId)?.name??`Deleted pot`:e.index<n?`Prepaid`:e.index>n?`Paying ahead`:null}var he=90,ge=2e3;function _e(e,t){return(e.amountChanges??[]).filter(e=>e.effectiveFrom<=t).sort((e,t)=>e.effectiveFrom.localeCompare(t.effectiveFrom)).at(-1)?.amount??e.amount}function ve(e,t,n){let r=[];for(let i=0;i<ge;i+=1){let a=b(e.startDate,e.frequency,i);if(e.endDate!==void 0&&a>e.endDate||a>n)break;a>=t&&r.push(a)}return r}function ye(e,t,n){let r=ve(e,g(t,-90),g(n,he)),i=[];for(let a of r){let r=e.overrides?.find(e=>e.date===a);if(r?.skipped===!0)continue;let o=r?.movedTo??a;_(o,t,n)&&i.push({id:`${e.id}::${a}`,date:o,amount:r?.amount??_e(e,a),entryType:e.entryType,status:r?.status??e.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`&&r?.amount===void 0,fundedFrom:r?.fundedFrom??null,paidOverride:r?.paid??null,paidOn:r?.paidOn??null})}return i.sort((e,t)=>e.date.localeCompare(t.date))}function be(e,t,n){switch(e.kind){case`recurring`:return ye(e,t,n);case`irregular`:return e.dates.filter(e=>_(e.date,t,n)).map(t=>({id:`${e.id}::${t.date}`,date:t.date,amount:t.amount,entryType:e.entryType,status:t.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`,fundedFrom:t.fundedFrom??null,paidOverride:t.paid??null,paidOn:t.paidOn??null}));case`one-off`:return _(e.date,t,n)?[{id:`${e.id}::${e.date}`,date:e.date,amount:e.amount,entryType:e.entryType,status:e.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`,fundedFrom:e.fundedFrom??null,paidOverride:e.paid??null,paidOn:e.paidOn??null}]:[]}}var xe=1e3;function Se(e,t,n){let r=0;for(;r<xe&&!(b(e,n,r+1)>t);)r+=1;return r}function Ce(e,t,n){let r=e.balance?.amount??0,i=e.targetAmount;if(i===null)return{balance:r,target:null,remaining:null,cyclesRemaining:null,requiredPerCycle:null,isFunded:!1,isOverdue:!1};let a=Math.max(0,i-r),o=a===0,s=e.targetDate!==null&&e.targetDate<t&&!o,c=e.targetDate===null?null:Se(t,e.targetDate,n),l=null;return e.mode===`active`&&(l=o?0:c===null?null:c===0?a:a/c),{balance:r,target:i,remaining:a,cyclesRemaining:c,requiredPerCycle:l,isFunded:o,isOverdue:s}}function we(e,t){return e.paidOverride===null?e.status===`received`||e.amountKind===`fixed`&&e.date<t:e.paidOverride}function Te(e,t){return we(e,t)?e.entryType===`income`?`Received`:`Paid`:e.status===`expected`?`Expected`:`Upcoming`}var Ee=400;function De(e,t){return e.filter(e=>t.includes(e.status)).reduce((e,t)=>e+t.amount,0)}function Oe(e){return e.reduce((e,t)=>e+t.amount,0)}function ke(e){let t=new Map;for(let n of e){let e=t.get(n.generatorId);(e===void 0||n.date<e.date)&&t.set(n.generatorId,n)}return[...t.values()].sort((e,t)=>e.date.localeCompare(t.date))}function Ae(e,t,n){let r=x(t,e.anchorDate,e.anchorCadence),i=de(e.anchorDate,e.anchorCadence,r,n),a=i[0]?.start??t,o=i.at(-1)?.end??t,s=g(o,Ee),c=e.pots.map(e=>({id:e.id,name:e.name})),l=e.generators.flatMap(e=>be(e,a,s)).map(n=>{let r=fe(n,e.anchorDate,e.anchorCadence),i=x(n.date,e.anchorDate,e.anchorCadence);return{...n,funding:r,dueWindowIndex:i,isSettled:we(n,t),statusLabel:Te(n,t),fundingNote:n.entryType===`expense`?me(r,c,i):null}}),u=i.map(n=>{let r=l.filter(e=>_(e.date,n.start,n.end)),i=r.filter(e=>e.entryType===`income`),a=r.filter(e=>e.entryType===`expense`),o=l.filter(e=>e.entryType===`expense`&&pe(e.funding,n.index)),s=De(i,[`received`,`confirmed`]),c=De(i,[`expected`]),u=Oe(o.filter(e=>e.amountKind===`fixed`)),d=Oe(o.filter(e=>e.amountKind===`variable`)),f=u+d,p=e.potContributions[String(n.index)]??{},m=e.pots.map(e=>({potId:e.id,name:e.name,amount:p[e.id]??0})),h=m.reduce((e,t)=>e+t.amount,0),g=s+c-f-h,v=e.livingEstimates[String(n.index)]??null;return{...n,isCurrent:_(t,n.start,n.end),income:i,expenses:a,confirmedIncome:s,expectedIncome:c,fixedExpenses:u,variableExpenses:d,chargedExpenses:f,contributions:m,totalContributions:h,planSurplus:g,livingEstimate:v,leftAfterLiving:v===null?null:g-v}}),d=u[0]?.end??t,f=u[0]?.index??r;return{windows:u,summary:le({balance:e.mainBalance,entries:l,cycleStart:u[0]?.start??t,horizon:d,safetyBuffer:e.safetyBuffer,today:t,isOutstandingHere:t=>pe(fe(t,e.anchorDate,e.anchorCadence),f),potContributions:u[0]?.totalContributions??0}),pots:e.pots.map(n=>({...n,progress:Ce(n,t,e.anchorCadence)})),upcomingBeyond:ke(l.filter(e=>e.date>o))}}function S(e){return`${e}-${typeof crypto<`u`&&`randomUUID`in crypto?crypto.randomUUID().slice(0,8):Math.random().toString(36).slice(2,10)}`}function je(e,t){return{...e,generators:[...e.generators,t]}}function Me(e,t){return e.generators.some(e=>e.id===t.id)?{...e,generators:e.generators.map(e=>e.id===t.id?t:e)}:e}function Ne(e,t){return e.generators.some(e=>e.id===t)?{...e,generators:e.generators.filter(e=>e.id!==t)}:e}function Pe(e,t){return{...e,pots:[...e.pots,t]}}function Fe(e,t){return e.pots.some(e=>e.id===t.id)?{...e,pots:e.pots.map(e=>e.id===t.id?t:e)}:e}function Ie(e,t){let n=e=>{if(e.fundedFrom?.kind!==`pot`||e.fundedFrom.potId!==t)return e;let{fundedFrom:n,...r}=e;return r};switch(e.kind){case`recurring`:return e.overrides===void 0?e:{...e,overrides:e.overrides.map(n)};case`irregular`:return{...e,dates:e.dates.map(n)};case`one-off`:return n(e)}}function Le(e,t){if(!e.pots.some(e=>e.id===t))return e;let n={};for(let[r,i]of Object.entries(e.potContributions)){let{[t]:e,...a}=i;Object.keys(a).length>0&&(n[r]=a)}return{...e,pots:e.pots.filter(e=>e.id!==t),potContributions:n,generators:e.generators.map(e=>Ie(e,t))}}function Re(e,t){let n=0;for(let r of e.generators)switch(r.kind){case`recurring`:n+=(r.overrides??[]).filter(e=>e.fundedFrom?.kind===`pot`&&e.fundedFrom.potId===t).length;break;case`irregular`:n+=r.dates.filter(e=>e.fundedFrom?.kind===`pot`&&e.fundedFrom.potId===t).length;break;case`one-off`:r.fundedFrom?.kind===`pot`&&r.fundedFrom.potId===t&&(n+=1)}let r=Object.values(e.potContributions).filter(e=>e[t]!==void 0).length;return{fundedEntries:n,contributedCycles:r}}var C=/^\d{4}-\d{2}-\d{2}$/;function ze(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function Be(e){return{id:``,label:``,entryType:`expense`,amountKind:`fixed`,kind:`recurring`,status:`confirmed`,amount:``,frequency:`monthly`,startDate:e,endDate:``,date:e,instalments:[{date:e,amount:``}]}}function Ve(e,t){let n={...Be(t),id:e.id,label:e.label,entryType:e.entryType,amountKind:e.amountKind,kind:e.kind};switch(e.kind){case`recurring`:return{...n,status:e.status,amount:String(e.amount),frequency:e.frequency,startDate:e.startDate,endDate:e.endDate??``};case`one-off`:return{...n,status:e.status,amount:String(e.amount),date:e.date};case`irregular`:return{...n,instalments:e.dates.map(e=>({date:e.date,amount:String(e.amount)}))}}}function He(e){let t=e.label.trim();if(t===``)return{ok:!1,error:`Give it a name so you can recognise it.`};let n={id:e.id,label:t,entryType:e.entryType,amountKind:e.amountKind};if(e.kind===`irregular`){let t=e.instalments.filter(e=>e.date.trim()!==``||e.amount.trim()!==``);if(t.length===0)return{ok:!1,error:`Add at least one instalment, with a date and an amount.`};let r=[];for(let n of t){let t=ze(n.amount);if(!C.test(n.date))return{ok:!1,error:`Every instalment needs a date.`};if(t===null)return{ok:!1,error:`Every instalment needs an amount of zero or more.`};r.push({date:n.date,amount:t,status:e.status})}return{ok:!0,generator:{...n,kind:`irregular`,dates:r.sort((e,t)=>e.date.localeCompare(t.date))}}}let r=ze(e.amount);if(r===null)return{ok:!1,error:e.amountKind===`variable`?`Give a typical amount to estimate with — you can correct it each time.`:`Enter an amount of zero or more.`};if(e.kind===`one-off`)return C.test(e.date)?{ok:!0,generator:{...n,kind:`one-off`,date:e.date,amount:r,status:e.status}}:{ok:!1,error:`Pick a date.`};if(!C.test(e.startDate))return{ok:!1,error:`Pick the date this starts from.`};let i=e.endDate.trim();return i!==``&&!C.test(i)?{ok:!1,error:`That end date isn't a real date.`}:i!==``&&i<e.startDate?{ok:!1,error:`It can't end before it starts.`}:{ok:!0,generator:{...n,kind:`recurring`,frequency:e.frequency,amount:r,startDate:e.startDate,status:e.status,...i===``?{}:{endDate:i}}}}var Ue=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`],We=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`];function w(e){return`${e<0?`-`:``}$${Math.abs(e).toLocaleString(`en-AU`,{minimumFractionDigits:2,maximumFractionDigits:2})}`}function T(e){let[t,n,r]=e.split(`-`).map(Number);return t===void 0||n===void 0||r===void 0?e:`${r} ${Ue[n-1]}`}function E(e){let[t,n,r]=e.split(`-`).map(Number);return t===void 0||n===void 0||r===void 0?e:`${We[new Date(Date.UTC(t,n-1,r)).getUTCDay()]} ${r} ${Ue[n-1]}`}function Ge(e){return e===0?`today`:e===1?`1 day ago`:`${e} days ago`}function D(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}var Ke=[[`recurring`,`Repeats`,`Same thing every week, fortnight or month`],[`one-off`,`Just once`,`A single dated payment`],[`irregular`,`Split into instalments`,`One cost spread over several dates`]],qe=[[`weekly`,`Every week`],[`fortnightly`,`Every fortnight`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Every month`]];function O(e,t,n){return`<div class="radio-row">
    ${n.map(([n,r,i])=>`
        <label class="radio-card${t===n?` selected`:``}">
          <input type="radio" name="${e}" value="${n}"${t===n?` checked`:``}>
          <span class="radio-label">${r}</span>
          ${i===void 0?``:`<span class="radio-hint">${i}</span>`}
        </label>`).join(``)}
  </div>`}function Je(e,t){let n=e.amountKind===`variable`;return`
    <dialog id="generatorDialog" class="dialog dialog-wide">
      <div class="dialog-body">
        <h2>${t?`Add income or a bill`:`Edit ${D(e.label||`entry`)}`}</h2>

        <label class="field">
          <span>What is it</span>
          <input type="text" id="genLabel" value="${D(e.label)}"
            placeholder="Rent, Salary, Power…" maxlength="60" autocomplete="off">
        </label>

        <div class="field">
          <span>Money in or out</span>
          ${O(`genType`,e.entryType,[[`income`,`Money in`],[`expense`,`Money out`]])}
        </div>

        <div class="field">
          <span>Is the amount the same every time</span>
          ${O(`genAmountKind`,e.amountKind,[[`fixed`,`Always the same`,`Rent, a subscription`],[`variable`,`Changes each time`,`Power, a credit card`]])}
        </div>

        <div class="field">
          <span>When</span>
          ${O(`genKind`,e.kind,Ke)}
        </div>

        ${e.kind===`irregular`?`
          <div class="field">
            <span>Instalments</span>
            <div class="instalments">
              ${e.instalments.map((t,n)=>`
                <div class="instalment-row">
                  <input type="date" data-inst-date="${n}" value="${t.date}">
                  <span class="balance-input-wrap">
                    <span class="currency">$</span>
                    <input type="number" step="0.01" min="0" data-inst-amount="${n}"
                      value="${D(t.amount)}" placeholder="0.00">
                  </span>
                  <button type="button" class="ghost-btn tiny" data-inst-remove="${n}"
                    ${e.instalments.length===1?`disabled`:``}
                    aria-label="Remove instalment">Remove</button>
                </div>`).join(``)}
            </div>
            <button type="button" class="ghost-btn" id="addInstalment">Add instalment</button>
          </div>`:`
          <label class="field">
            <span>${n?`Typical amount`:`Amount`}</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="genAmount" step="0.01" min="0"
                value="${D(e.amount)}" placeholder="0.00">
            </span>
            ${n?`<small>Used as the estimate until you enter the real figure each time.</small>`:``}
          </label>`}

        ${e.kind===`recurring`?`
          <label class="field">
            <span>How often</span>
            <select id="genFrequency">
              ${qe.map(([t,n])=>`<option value="${t}"${e.frequency===t?` selected`:``}>${n}</option>`).join(``)}
            </select>
          </label>
          <div class="field-pair">
            <label class="field">
              <span>First one on</span>
              <input type="date" id="genStart" value="${e.startDate}">
            </label>
            <label class="field">
              <span>Stops after (optional)</span>
              <input type="date" id="genEnd" value="${D(e.endDate)}">
            </label>
          </div>`:``}

        ${e.kind===`one-off`?`
          <label class="field">
            <span>Date</span>
            <input type="date" id="genDate" value="${e.date}">
          </label>`:``}

        <div class="field">
          <span>How sure are you</span>
          ${O(`genStatus`,e.status,[[`confirmed`,`Confirmed`,`It is definitely happening`],[`expected`,`Expected`,`Likely, but not locked in`]])}
        </div>

        <p class="dialog-error" id="genError" hidden></p>

        <div class="dialog-actions">
          ${t?``:`<button type="button" class="danger-btn" id="genDelete">Delete</button>`}
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="genCancel">Cancel</button>
          <button type="button" class="primary-btn" id="genSave">
            ${t?`Add`:`Save`}
          </button>
        </div>
      </div>
    </dialog>`}function k(e,t){let n=t=>e.querySelector(t),r=(t,n)=>e.querySelector(`input[name="${t}"]:checked`)?.value??n,i=[...e.querySelectorAll(`.instalment-row`)].map(e=>({date:e.querySelector(`[data-inst-date]`)?.value??``,amount:e.querySelector(`[data-inst-amount]`)?.value??``}));return{...t,label:n(`#genLabel`)?.value??t.label,entryType:r(`genType`,t.entryType),amountKind:r(`genAmountKind`,t.amountKind),kind:r(`genKind`,t.kind),status:r(`genStatus`,t.status),amount:n(`#genAmount`)?.value??t.amount,frequency:n(`#genFrequency`)?.value??t.frequency,startDate:n(`#genStart`)?.value??t.startDate,endDate:n(`#genEnd`)?.value??t.endDate,date:n(`#genDate`)?.value??t.date,instalments:i.length>0?i:t.instalments}}var Ye=/^\d{4}-\d{2}-\d{2}$/;function Xe(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function Ze(e){return{id:``,name:``,balance:``,balanceAsOf:e,targetAmount:``,targetDate:``,mode:`passive`}}function Qe(e,t){return{id:e.id,name:e.name,balance:e.balance===null?``:String(e.balance.amount),balanceAsOf:e.balance?.asOfDateTime.slice(0,10)??t,targetAmount:e.targetAmount===null?``:String(e.targetAmount),targetDate:e.targetDate??``,mode:e.mode}}function $e(e,t){let n=e.name.trim();if(n===``)return{ok:!1,error:`Give the pot a name.`};let r=Xe(e.balance);if(e.balance.trim()!==``&&r===null)return{ok:!1,error:`That balance isn't a number of zero or more.`};let i=e.balanceAsOf.trim();if(r!==null&&!Ye.test(i))return{ok:!1,error:`Pick the date this pot balance was read.`};let a=i>t?t:i,o=Xe(e.targetAmount);if(e.targetAmount.trim()!==``&&o===null)return{ok:!1,error:`That target isn't a number of zero or more.`};let s=e.targetDate.trim();return s!==``&&!Ye.test(s)?{ok:!1,error:`That target date isn't a real date.`}:e.mode===`active`&&(o===null||s===``)?{ok:!1,error:`To work out how much to put away each pay, this needs both a target amount and a date to reach it by.`}:{ok:!0,pot:{id:e.id,name:n,balance:r===null?null:{amount:r,asOfDateTime:a},targetAmount:o,targetDate:s===``?null:s,mode:e.mode}}}function et(e){let t=[];return e.fundedEntries>0&&t.push(`${e.fundedEntries} ${e.fundedEntries===1?`bill is`:`bills are`} paid from it`),e.contributedCycles>0&&t.push(`${e.contributedCycles} pay ${e.contributedCycles===1?`cycle puts`:`cycles put`} money in`),t.length===0?``:`<p class="dialog-note">Deleting this pot: ${t.join(`, `)}. Those bills go back to
    being paid from the cycle they fall in.</p>`}function tt(e,t,n){let r=e.mode===`active`;return`
    <dialog id="potDialog" class="dialog">
      <div class="dialog-body">
        <h2>${t?`Add a savings pot`:`Edit ${D(e.name||`pot`)}`}</h2>

        <label class="field">
          <span>What is it for</span>
          <input type="text" id="potName" value="${D(e.name)}"
            placeholder="Car rego, Christmas, Future bills…" maxlength="60" autocomplete="off">
        </label>

        <div class="field-pair">
          <label class="field">
            <span>How much is in it</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="potBalance" step="0.01" min="0"
                value="${D(e.balance)}" placeholder="0.00">
            </span>
          </label>
          <label class="field">
            <span>As of</span>
            <input type="date" id="potBalanceAsOf" value="${e.balanceAsOf}">
          </label>
        </div>
        <small class="field-note">This money sits in its own account, so it is never counted
          as safe to spend.</small>

        <div class="field">
          <span>Are you saving toward something</span>
          <div class="radio-row">
            <label class="radio-card${r?``:` selected`}">
              <input type="radio" name="potMode" value="passive"${r?``:` checked`}>
              <span class="radio-label">Just setting money aside</span>
              <span class="radio-hint">Track what is in it, no target</span>
            </label>
            <label class="radio-card${r?` selected`:``}">
              <input type="radio" name="potMode" value="active"${r?` checked`:``}>
              <span class="radio-label">Working toward an amount</span>
              <span class="radio-hint">Fortify works out how much per pay</span>
            </label>
          </div>
        </div>

        <div class="field-pair">
          <label class="field">
            <span>Target${r?``:` (optional)`}</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="potTarget" step="0.01" min="0"
                value="${D(e.targetAmount)}" placeholder="0.00">
            </span>
          </label>
          <label class="field">
            <span>Needed by${r?``:` (optional)`}</span>
            <input type="date" id="potTargetDate" value="${D(e.targetDate)}">
          </label>
        </div>

        ${t?``:et(n)}
        <p class="dialog-error" id="potError" hidden></p>

        <div class="dialog-actions">
          ${t?``:`<button type="button" class="danger-btn" id="potDelete">Delete</button>`}
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="potCancel">Cancel</button>
          <button type="button" class="primary-btn" id="potSave">${t?`Add`:`Save`}</button>
        </div>
      </div>
    </dialog>`}function nt(e,t){let n=t=>e.querySelector(`#${t}`)?.value;return{...t,name:n(`potName`)??t.name,balance:n(`potBalance`)??t.balance,balanceAsOf:n(`potBalanceAsOf`)??t.balanceAsOf,targetAmount:n(`potTarget`)??t.targetAmount,targetDate:n(`potTargetDate`)??t.targetDate,mode:e.querySelector(`input[name="potMode"]:checked`)?.value??t.mode}}var rt=/^\d{4}-\d{2}-\d{2}$/;function A(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function it(e){return{step:1,name:`My budget`,cadence:`fortnightly`,anchorDate:e,incomeLabel:``,incomeAmount:``,balance:``}}function at(e,t){return t===1?e.name.trim()===``?`Give this budget a name.`:rt.test(e.anchorDate)?null:`Pick a recent payday.`:t===2?e.incomeLabel.trim()===``?`What is this income called?`:A(e.incomeAmount)===null?`How much lands each time? Enter zero or more.`:null:e.balance.trim()!==``&&A(e.balance)===null?`That balance isn't a number of zero or more.`:null}function ot(e,t=4){return rt.test(e.anchorDate)?de(e.anchorDate,e.cadence,0,t):[]}function st(e,t){let n={id:S(`gen`),kind:`recurring`,label:e.incomeLabel.trim(),entryType:`income`,amountKind:`fixed`,frequency:e.cadence,amount:A(e.incomeAmount)??0,startDate:e.anchorDate,status:`confirmed`},r=A(e.balance);return{id:S(`budget`),name:e.name.trim(),anchorDate:e.anchorDate,anchorCadence:e.cadence,safetyBuffer:0,livingEstimates:{},potContributions:{},mainBalance:r===null?null:{amount:r,asOfDateTime:t},pots:[],generators:[n]}}var ct=[[`weekly`,`Weekly`],[`fortnightly`,`Fortnightly`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Monthly`]],lt=[``,`When do you get paid?`,`What is your main income?`,`What is in your account right now?`],ut=[``,`Fortify organises everything around your pay cycle rather than the calendar month, so the question it answers is always the same one: will this last until the next payday?`,`The regular one that everything else is planned around. You can add side income, rent and one-off payments once you are set up.`,`This is what turns a forecast into a figure you can actually spend against. You can skip it and add it later.`];function dt(e,t){let n=ot(e);if(n.length===0)return``;if(t===1)return`
      <div class="wiz-preview">
        <p class="wiz-preview-label">Your cycles would be</p>
        <ul class="wiz-cycles">
          ${n.map((e,t)=>`
            <li class="${t===0?`is-current`:``}">
              <strong>${E(e.start)}</strong>
              <span>to ${T(e.end)}</span>
            </li>`).join(``)}
        </ul>
      </div>`;let r=Number(e.incomeAmount),i=Number.isFinite(r)&&e.incomeAmount.trim()!==``,a=e.incomeLabel.trim()||`Your income`;if(t===2)return`
      <div class="wiz-preview">
        <p class="wiz-preview-label">Your first cycle would start</p>
        <ul class="wiz-cycles">
          <li class="is-current">
            <strong>${E(n[0]?.start??e.anchorDate)}</strong>
            <span>${D(a)} ${i?`+${w(r)}`:``}</span>
          </li>
        </ul>
        <p class="wiz-preview-note">Repeating every cycle from then on.</p>
      </div>`;let o=Number(e.balance),s=Number.isFinite(o)&&e.balance.trim()!==``;return`
    <div class="wiz-preview">
      <p class="wiz-preview-label">${s?`Safe to spend would start from`:`Without a balance you would see`}</p>
      <p class="wiz-figure">${s?w(o):i?w(r):`—`}</p>
      <p class="wiz-preview-note">
        ${s?`Then adjusted for everything due before ${T(n[0]?.end??e.anchorDate)}.`:`The planned figure only — a forecast from your schedule, not money you have.`}
      </p>
    </div>`}function ft(e,t){let n=e.step;return`
    <div class="wizard">
      <header class="wiz-header">
        <h1>Fortify</h1>
        <p class="wiz-progress">Step ${n} of 3</p>
      </header>

      <div class="wiz-card">
        <div class="wiz-form">
          <h2>${lt[n]}</h2>
          <p class="wiz-blurb">${ut[n]}</p>

          ${n===1?`
            <label class="field">
              <span>Name this budget</span>
              <input type="text" id="wizName" value="${D(e.name)}"
                maxlength="60" autocomplete="off">
            </label>
            <label class="field">
              <span>How often you are paid</span>
              <select id="wizCadence">
                ${ct.map(([t,n])=>`<option value="${t}"${e.cadence===t?` selected`:``}>${n}</option>`).join(``)}
              </select>
            </label>
            <label class="field">
              <span>Your most recent payday</span>
              <input type="date" id="wizAnchor" value="${e.anchorDate}">
              <small>Every cycle is counted from this date.</small>
            </label>`:``}

          ${n===2?`
            <label class="field">
              <span>What is it called</span>
              <input type="text" id="wizIncomeLabel" value="${D(e.incomeLabel)}"
                placeholder="Salary, Wages, Pension…" maxlength="60" autocomplete="off">
            </label>
            <label class="field">
              <span>How much lands each time</span>
              <span class="balance-input-wrap">
                <span class="currency">$</span>
                <input type="number" id="wizIncomeAmount" step="0.01" min="0"
                  value="${D(e.incomeAmount)}" placeholder="0.00">
              </span>
              <small>Take-home, after tax.</small>
            </label>`:``}

          ${n===3?`
            <label class="field">
              <span>Balance in your spending account</span>
              <span class="balance-input-wrap">
                <span class="currency">$</span>
                <input type="number" id="wizBalance" step="0.01" min="0"
                  value="${D(e.balance)}" placeholder="0.00">
              </span>
              <small>Optional — you can add it any time from the main screen.</small>
            </label>`:``}

          ${t===null?``:`<p class="dialog-error">${D(t)}</p>`}

          <div class="wiz-actions">
            ${n>1?`<button type="button" class="ghost-btn" id="wizBack">Back</button>`:``}
            <span class="spacer"></span>
            <button type="button" class="primary-btn" id="wizNext">
              ${n===3?`Finish`:`Next`}
            </button>
          </div>
        </div>

        ${dt(e,n)}
      </div>

      <p class="wiz-escape">
        Just looking? <button type="button" class="link-btn" id="wizSample">Load an example budget</button>
      </p>
    </div>`}function pt(e,t){let n=t=>e.querySelector(`#${t}`)?.value;return{...t,name:n(`wizName`)??t.name,cadence:n(`wizCadence`)??t.cadence,anchorDate:n(`wizAnchor`)??t.anchorDate,incomeLabel:n(`wizIncomeLabel`)??t.incomeLabel,incomeAmount:n(`wizIncomeAmount`)??t.incomeAmount,balance:n(`wizBalance`)??t.balance}}function mt(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function ht(e,t){let n=t.trim();return n===``?e:{...e,name:n}}function gt(e,t){let n=mt(t);return{...e,safetyBuffer:n??0}}function _t(e,t,n){let r=mt(t);return{...e,mainBalance:r===null?null:{amount:r,asOfDateTime:n}}}function vt(e,t,n){return e.mainBalance===null||!/^\d{4}-\d{2}-\d{2}$/.test(t)?e:{...e,mainBalance:{...e.mainBalance,asOfDateTime:t>n?n:t}}}function yt(e){return Object.keys(e.livingEstimates).length>0||Object.keys(e.potContributions).length>0||e.generators.some(bt)}function bt(e){switch(e.kind){case`recurring`:return(e.overrides??[]).some(e=>e.fundedFrom?.kind===`window`);case`irregular`:return e.dates.some(e=>e.fundedFrom?.kind===`window`);case`one-off`:return e.fundedFrom?.kind===`window`}}function xt(e){let t=e=>{if(e.fundedFrom?.kind!==`window`)return e;let{fundedFrom:t,...n}=e;return n};switch(e.kind){case`recurring`:return e.overrides===void 0?e:{...e,overrides:e.overrides.map(t)};case`irregular`:return{...e,dates:e.dates.map(t)};case`one-off`:return t(e)}}function St(e,t,n){return e.anchorDate===t&&e.anchorCadence===n?e:{...e,anchorDate:t,anchorCadence:n,livingEstimates:{},potContributions:{},generators:e.generators.map(xt)}}function Ct(e){let t=g(e,-4);return{id:`sample`,name:`Household`,anchorDate:t,anchorCadence:`fortnightly`,safetyBuffer:150,livingEstimates:{0:620},potContributions:{0:{rego:60,christmas:40}},mainBalance:{amount:2140.55,asOfDateTime:g(e,-2)},pots:[{id:`bills`,name:`Future bills`,balance:{amount:540,asOfDateTime:g(e,-2)},targetAmount:null,targetDate:null,mode:`passive`},{id:`rego`,name:`Car registration`,balance:{amount:260,asOfDateTime:g(e,-2)},targetAmount:680,targetDate:g(e,180),mode:`active`},{id:`christmas`,name:`Christmas`,balance:{amount:120,asOfDateTime:g(e,-2)},targetAmount:null,targetDate:null,mode:`passive`}],generators:[{id:`salary`,kind:`recurring`,label:`Salary`,entryType:`income`,amountKind:`fixed`,frequency:`fortnightly`,amount:2865,startDate:t,status:`confirmed`},{id:`rent`,kind:`recurring`,label:`Rent`,entryType:`expense`,amountKind:`fixed`,frequency:`fortnightly`,amount:650,startDate:g(t,1),status:`confirmed`},{id:`power`,kind:`recurring`,label:`Power`,entryType:`expense`,amountKind:`variable`,frequency:`monthly`,amount:185.4,startDate:g(e,6),status:`expected`},{id:`phone`,kind:`recurring`,label:`Phone & internet`,entryType:`expense`,amountKind:`fixed`,frequency:`monthly`,amount:99,startDate:g(e,11),status:`confirmed`,overrides:[{date:g(e,11),fundedFrom:{kind:`window`,index:0}}]},{id:`creditcard`,kind:`recurring`,label:`Credit card`,entryType:`expense`,amountKind:`variable`,frequency:`monthly`,amount:320,startDate:g(e,9),status:`expected`},{id:`streaming`,kind:`recurring`,label:`Streaming`,entryType:`expense`,amountKind:`fixed`,frequency:`monthly`,amount:22.99,startDate:g(e,4),status:`confirmed`,overrides:[{date:g(e,4),fundedFrom:{kind:`external`}}]},{id:`groceries`,kind:`recurring`,label:`Groceries`,entryType:`expense`,amountKind:`variable`,frequency:`weekly`,amount:180,startDate:g(e,2),status:`expected`},{id:`invoice`,kind:`one-off`,label:`Freelance invoice #114`,entryType:`income`,amountKind:`fixed`,date:g(e,5),amount:620,status:`expected`},{id:`rental`,kind:`recurring`,label:`Rental income`,entryType:`income`,amountKind:`fixed`,frequency:`monthly`,amount:430,startDate:g(e,8),status:`confirmed`},{id:`rego-bill`,kind:`one-off`,label:`Car registration`,entryType:`expense`,amountKind:`fixed`,date:g(e,180),amount:680,status:`confirmed`,fundedFrom:{kind:`pot`,potId:`rego`}},{id:`insurance`,kind:`irregular`,label:`Car insurance`,entryType:`expense`,amountKind:`fixed`,dates:[{date:g(e,30),amount:140,status:`confirmed`,fundedFrom:{kind:`pot`,potId:`bills`}},{date:g(e,61),amount:110,status:`expected`},{date:g(e,92),amount:110,status:`expected`}]}]}}var wt=[`weekly`,`fortnightly`,`four-weekly`,`monthly`];function j(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function M(e){return typeof e==`string`&&/^\d{4}-\d{2}-\d{2}/.test(e)}function N(e){return typeof e==`number`&&Number.isFinite(e)}function Tt(e){return e===null||j(e)&&N(e.amount)&&M(e.asOfDateTime)}function Et(e){return j(e)?typeof e.id==`string`&&typeof e.name==`string`&&Tt(e.balance)&&(e.targetAmount===null||N(e.targetAmount))&&(e.targetDate===null||M(e.targetDate))&&(e.mode===`active`||e.mode===`passive`):!1}function Dt(e){if(!j(e)||typeof e.id!=`string`||typeof e.label!=`string`||e.entryType!==`income`&&e.entryType!==`expense`||e.amountKind!==`fixed`&&e.amountKind!==`variable`)return!1;switch(e.kind){case`recurring`:return N(e.amount)&&M(e.startDate)&&wt.includes(e.frequency);case`one-off`:return N(e.amount)&&M(e.date);case`irregular`:return Array.isArray(e.dates)&&e.dates.every(e=>j(e)&&M(e.date)&&N(e.amount));default:return!1}}function Ot(e){return j(e)&&Object.values(e).every(N)}function kt(e){return j(e)&&Object.values(e).every(Ot)}function At(e){let t;try{t=JSON.parse(e)}catch{return{ok:!1,error:`That file isn't valid JSON.`}}if(!j(t))return{ok:!1,error:`That file isn't a Fortify backup.`};let n=t.schemaVersion;if(typeof n!=`number`)return{ok:!1,error:`That file isn't a Fortify backup.`};if(n>1)return{ok:!1,error:`That backup was saved by a newer version of Fortify (format ${n}). Update Fortify and try again.`};let r=t.budget;return j(r)?typeof r.id!=`string`||typeof r.name!=`string`?{ok:!1,error:`That backup is missing its budget details.`}:!M(r.anchorDate)||!wt.includes(r.anchorCadence)?{ok:!1,error:`That backup has no valid pay cycle.`}:!N(r.safetyBuffer)||!Tt(r.mainBalance)?{ok:!1,error:`That backup has an invalid balance or buffer.`}:!Array.isArray(r.pots)||!r.pots.every(Et)?{ok:!1,error:`That backup has an invalid savings pot.`}:!Array.isArray(r.generators)||!r.generators.every(Dt)?{ok:!1,error:`That backup has an invalid income or expense.`}:Ot(r.livingEstimates)?kt(r.potContributions)?{ok:!0,budget:r}:{ok:!1,error:`That backup has invalid savings contributions.`}:{ok:!1,error:`That backup has invalid living expenses.`}:{ok:!1,error:`That backup has no budget in it.`}}function jt(e){let t={schemaVersion:1,exportedAt:new Date().toISOString(),budget:e};return JSON.stringify(t,null,2)}function Mt(e,t){return`fortify-${e.name.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`budget`}-${t}.json`}var Nt=`fortify`,Pt=2,P=`budgets`,F=`usage`,Ft=`current`;function It(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`IndexedDB request failed`))})}function Lt(){return new Promise((e,t)=>{if(typeof indexedDB>`u`){t(Error(`This browser has no local storage available.`));return}let n;try{n=indexedDB.open(Nt,Pt)}catch{t(Error(`Local storage is blocked in this browser.`));return}n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(P)||e.createObjectStore(P,{keyPath:`key`}),e.objectStoreNames.contains(F)||e.createObjectStore(F,{keyPath:`seq`,autoIncrement:!0})},n.onsuccess=()=>{let t=n.result;t.onversionchange=()=>t.close(),e(t)},n.onblocked=()=>t(Error(`Another Fortify tab is open. Close it and reload.`)),n.onerror=()=>t(Error(`Couldn't open local storage — it may be turned off.`))})}async function Rt(e,t){let n={key:Ft,schemaVersion:1,savedAt:new Date().toISOString(),budget:t};await new Promise((t,r)=>{let i=e.transaction(P,`readwrite`);i.objectStore(P).put(n),i.oncomplete=()=>t(),i.onabort=()=>r(i.error??Error(`Save was cancelled — storage may be full.`)),i.onerror=()=>r(i.error??Error(`Save failed.`))})}async function zt(e){let t=await It(e.transaction(P,`readonly`).objectStore(P).get(Ft));if(t===void 0)return null;if(t.schemaVersion>1)throw Error(`Your saved budget was written by a newer version of Fortify. Update to open it.`);return t.budget}async function Bt(e,t){await new Promise(n=>{try{let r=e.transaction(F,`readwrite`);r.objectStore(F).add(t),r.oncomplete=()=>n(),r.onerror=()=>n(),r.onabort=()=>n()}catch{n()}})}async function Vt(e){return(await It(e.transaction(F,`readonly`).objectStore(F).getAll())).map(({seq:e,...t})=>t)}async function Ht(e){await new Promise((t,n)=>{let r=e.transaction(F,`readwrite`);r.objectStore(F).clear(),r.oncomplete=()=>t(),r.onerror=()=>n(r.error)})}var Ut=[`entry_added`,`entry_edited`,`entry_deleted`,`pot_added`,`pot_edited`,`pot_deleted`,`settings_saved`];function Wt(e){return e.slice(0,10)}function Gt(e){if(e.length===0)return null;let t=[...e].sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2==1?t[n]??null:((t[n-1]??0)+(t[n]??0))/2}function Kt(e,t){let n=Date.parse(`${t}T00:00:00Z`)-Date.parse(`${e}T00:00:00Z`);return Math.round(n/864e5)}function qt(e){let t={};for(let n of e)t[n.event]=(t[n.event]??0)+1;let n=[...e].sort((e,t)=>e.at.localeCompare(t.at)),r=[...new Set(n.map(e=>Wt(e.at)))].sort(),i=0;for(let e=1;e<r.length;e+=1){let t=Kt(r[e-1]??``,r[e]??``)-1;t>i&&(i=t)}let a=n.find(e=>e.event===`setup_started`),o=n.find(e=>e.event===`setup_completed`),s=a!==void 0&&o!==void 0?Math.round((Date.parse(o.at)-Date.parse(a.at))/6e4*10)/10:null,c=n.filter(e=>e.event===`opened`&&e.balanceAgeDays!==void 0).map(e=>e.balanceAgeDays),l=new Set(n.filter(e=>e.cycleIndex!==void 0).map(e=>e.cycleIndex)),u=e=>t[e]??0;return{firstSeen:n[0]?.at??null,lastSeen:n.at(-1)?.at??null,activeDays:r.length,longestGapDays:i,cyclesVisited:l.size,setupMinutes:s,balanceUpdates:u(`balance_updated`),medianBalanceAgeDays:Gt(c),amountsEntered:u(`amount_entered`),markedPaid:u(`marked_paid`),fundingChanges:u(`funding_changed`),contributionsSet:u(`contribution_set`),edits:Ut.reduce((e,t)=>e+u(t),0),modeViews:{plan:u(`mode_viewed_plan`),safe:u(`mode_viewed_safe`),expected:u(`mode_viewed_expected`)},exports:u(`exported`),imports:u(`imported`),totalEvents:e.length,counts:t}}function Jt(e){let t={kind:`fortify-usage`,schemaVersion:1,exportedAt:new Date().toISOString(),summary:qt(e),events:e};return JSON.stringify(t,null,2)}function Yt(e){switch(e.kind){case`saving`:return`<span class="save-state">Saving…</span>`;case`saved`:return`<span class="save-state is-saved" title="Saved to this browser at ${D(e.at)}">Saved</span>`;case`error`:return`<span class="save-state is-error" title="${D(e.message)}">Not saved</span>`;case`unavailable`:return`<span class="save-state is-error" title="${D(e.message)}">Not saving</span>`}}function Xt(e,t){return e.summary.hasBalance?t:`plan`}function Zt(e,t){let{summary:n}=e;return t===`safe`?n.conservative??n.plan:t===`expected`?n.expected??n.plan:n.plan}function Qt(e,t){let n=E(e.summary.nextAnchorDate);return t===`plan`?`Planned surplus for this pay cycle. This is a forecast from your schedule, not money you have.`:t===`safe`?`Estimated safe to spend until ${n}, from confirmed money only.`:`Expected to spend until ${n}, including income that is not confirmed yet.`}function $t(e,t){let n=!e.summary.hasBalance,r=(e,n,r)=>`
    <button class="mode-tab${t===e?` active`:``}" data-mode="${e}"
      ${r?`disabled`:``}
      ${r?`title="Add your current balance to see this"`:``}>
      ${n}
    </button>`;return`<div class="mode-tabs" role="tablist">
    ${r(`plan`,`Plan`,!1)}
    ${r(`safe`,`Safe to spend`,n)}
    ${r(`expected`,`Expected`,n)}
  </div>`}function en(e,t,n,r){let{summary:i}=e,a=i.balanceAgeDays!==null&&i.balanceAgeDays>7;return`
    <div class="balance-control${i.hasBalance?``:` is-empty`}">
      <label class="balance-field">
        <span class="balance-label">Balance in your account</span>
        <span class="balance-input-wrap">
          <span class="currency">$</span>
          <input
            type="number" inputmode="decimal" step="0.01" min="0"
            id="balanceInput"
            value="${t??``}"
            placeholder="Add yours"
            aria-label="Current balance in your spending account">
        </span>
      </label>
      ${i.hasBalance?`<label class="balance-field">
              <span class="balance-label">as of</span>
              <input type="date" id="balanceDate" value="${n??``}" max="${r}"
                aria-label="Date this balance was read">
            </label>`:``}
      <span class="balance-note${a?` is-stale`:``}">
        ${i.hasBalance&&i.balanceAgeDays!==null?`${Ge(i.balanceAgeDays)}${a?` — worth refreshing`:``}`:`Without this, only the plan figure is available`}
      </span>
    </div>`}function tn(e,t){return`
    <dialog id="settingsDialog" class="dialog">
      <form method="dialog" class="dialog-body">
        <h2>Settings</h2>

        <label class="field">
          <span>Budget name</span>
          <input type="text" id="setName" value="${D(t.name)}" maxlength="60">
        </label>

        <label class="field">
          <span>How often you are paid</span>
          <select id="setCadence">
            ${[[`weekly`,`Weekly`],[`fortnightly`,`Fortnightly`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Monthly`]].map(([e,n])=>`<option value="${e}"${t.anchorCadence===e?` selected`:``}>${n}</option>`).join(``)}
          </select>
        </label>

        <label class="field">
          <span>A recent payday</span>
          <input type="date" id="setAnchor" value="${t.anchorDate}">
          <small>Every cycle is counted from this date.</small>
        </label>

        <label class="field">
          <span>Safety buffer</span>
          <span class="balance-input-wrap">
            <span class="currency">$</span>
            <input type="number" id="setBuffer" step="0.01" min="0" value="${t.safetyBuffer}">
          </span>
          <small>Held back from safe-to-spend so you are never at exactly zero.</small>
        </label>

        <div class="dialog-actions">
          <button type="submit" value="cancel" class="ghost-btn">Cancel</button>
          <button type="submit" value="save" class="primary-btn" id="saveSettings">Save</button>
        </div>
      </form>

      <div class="dialog-body dialog-section">
        <h3>Helping with testing</h3>
        <p class="field-note">
          Fortify keeps a private note of <em>which</em> things you use and when —
          never any amounts, names or dates from your budget. It stays on this
          device unless you send it.
        </p>
        <div class="dialog-actions">
          <button type="button" class="danger-btn" id="usageClear">Delete log</button>
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="usageDownload">Download usage log</button>
        </div>
      </div>
    </dialog>`}function nn(e){let{summary:t}=e,n=[];if(t.hasBalance&&t.balanceAgeDays!==null){let e=t.balanceAgeDays>7;n.push(`<span class="chip${e?` chip-warn`:``}">Balance updated ${Ge(t.balanceAgeDays)}</span>`)}else n.push(`<span class="chip chip-warn">No balance recorded</span>`);return n.push(`<span class="chip${t.unconfirmedCount>0?` chip-soft`:``}">${t.unconfirmedCount} unconfirmed ${t.unconfirmedCount===1?`entry`:`entries`}</span>`),n.push(`<span class="chip">Buffer ${w(t.safetyBuffer)}</span>`),n.push(`<span class="chip">Savings pots held separately</span>`),`<div class="assumptions">${n.join(``)}</div>`}function rn(e,t){let n=e.planSurplus;return`
    <article class="window-card ${t?`current`:``} ${n<0?`over`:n<300?`tight`:``}">
      <p class="wc-label">${E(e.start)}</p>
      <p class="wc-date">to ${T(e.end)}</p>
      <dl class="wc-stats">
        <div><dt>In</dt><dd class="pos">${w(e.confirmedIncome+e.expectedIncome)}</dd></div>
        <div><dt>Automatic</dt><dd class="neg">${w(e.fixedExpenses)}</dd></div>
        <div><dt>Manual</dt><dd class="neg">${w(e.variableExpenses)}</dd></div>
        <div class="wc-net"><dt>Left over</dt><dd class="${n<0?`neg`:`pos`}">${w(n)}</dd></div>
      </dl>
    </article>`}function an(e,t,n){if(e.entryType===`income`)return`<td class="cell-assign"></td>`;let r=e=>e?` selected`:``,i=e.funding,a=t.map(e=>`<option value="window:${e.index}"${r(i.kind===`window`&&i.index===e.index)}>${T(e.start)}</option>`).join(``),o=n.map(e=>`<option value="pot:${D(e.id)}"${r(i.kind===`pot`&&i.potId===e.id)}>${D(e.name)}</option>`).join(``);return`
    <td class="cell-assign">
      <select class="${i.kind===`pot`?`assign from-pot`:i.kind===`external`?`assign external`:`assign`}" data-entry="${D(e.id)}" aria-label="Paid from">
        <optgroup label="Pay cycle">${a}</optgroup>
        ${o?`<optgroup label="From a pot">${o}</optgroup>`:``}
        <option value="external"${r(i.kind===`external`)}>N/A — paid elsewhere</option>
      </select>
    </td>`}function on(e){let t=e.isSettled?`settled`:e.status;return e.entryType===`expense`&&e.amountKind===`variable`?`
      <td>
        <label class="paid-check${e.isSettled?` is-paid`:``}">
          <input type="checkbox" data-paid="${D(e.id)}"${e.isSettled?` checked`:``}>
          <span>${e.isSettled?`Paid`:`Mark paid`}</span>
        </label>
      </td>`:`<td><span class="status status-${t}">${e.statusLabel}</span></td>`}function sn(e,t,n){let r=e.entryType===`income`,i=`
    <div class="amount-entry${e.isEstimate?` is-estimate`:``}">
      <span class="currency">$</span>
      <input
        type="number" inputmode="decimal" step="0.01" min="0"
        class="amount-input"
        data-entry="${D(e.id)}"
        value="${e.isEstimate?``:e.amount}"
        placeholder="${e.amount.toFixed(2)}"
        aria-label="Amount for ${D(e.label)}"
        title="${e.isEstimate?`Estimated — enter the real amount when the bill arrives`:`Actual amount`}">
    </div>`,a=r?`<td class="cell-amount pos" colspan="2">+${w(e.amount)}</td>`:e.amountKind===`fixed`?`<td class="cell-amount neg">${w(e.amount)}</td>
         <td class="cell-amount muted">—</td>`:`<td class="cell-amount muted">—</td>
         <td class="cell-amount">${i}</td>`;return`
    <tr class="${[r?`row-income`:``,e.fundingNote===null?``:`row-elsewhere`].filter(Boolean).join(` `)}">
      <td class="cell-date">${T(e.date)}</td>
      <td class="cell-label">
        <button type="button" class="label-edit" data-edit-generator="${D(e.generatorId)}"
          title="Edit ${D(e.label)}">${D(e.label)}</button>
        ${e.fundingNote===null?``:`<span class="funding-note">${D(e.fundingNote)}</span>`}
      </td>
      ${a}
      ${an(e,t,n)}
      ${on(e)}
    </tr>`}function cn(e){let t=e.planSurplus,n=e.livingEstimate,r=e.leftAfterLiving;return`
    <tfoot>
      <tr class="totals-row">
        <td colspan="2">Cycle subtotal</td>
        <td class="cell-amount neg">${e.fixedExpenses>0?w(e.fixedExpenses):`—`}</td>
        <td class="cell-amount neg">${e.variableExpenses>0?w(e.variableExpenses):`—`}</td>
        <td></td>
        <td class="cell-total neg">${w(e.chargedExpenses)} out</td>
      </tr>
      <tr class="pots-row">
        <td colspan="2">Into savings</td>
        <td colspan="3">
          <div class="pot-contribs">
            ${e.contributions.map(t=>`
                <label class="contrib">
                  <span class="contrib-name">${D(t.name)}</span>
                  <span class="currency">$</span>
                  <input
                    type="number" inputmode="decimal" step="0.01" min="0"
                    class="contrib-input"
                    data-window="${e.index}"
                    data-pot="${D(t.potId)}"
                    value="${t.amount===0?``:t.amount}"
                    placeholder="0.00"
                    aria-label="Into ${D(t.name)} from this pay">
                </label>`).join(``)}
          </div>
        </td>
        <td class="cell-total ${e.totalContributions>0?`saved`:`muted`}">
          ${e.totalContributions>0?`${w(e.totalContributions)} saved`:`—`}
        </td>
      </tr>
      <tr class="living-row">
        <td colspan="2">Est. living expenses</td>
        <td class="cell-amount muted">—</td>
        <td class="cell-amount">
          <div class="amount-entry living-entry">
            <span class="currency">$</span>
            <input
              type="number" inputmode="decimal" step="0.01" min="0"
              class="living-input"
              data-window="${e.index}"
              value="${n??``}"
              placeholder="0.00"
              aria-label="Estimated living expenses for this cycle">
          </div>
        </td>
        <td></td>
        <td class="cell-hint">Food, fuel, etc.</td>
      </tr>
      <tr class="net-row">
        <td colspan="2">${n===null?`Left over`:`Left over after living`}</td>
        <td colspan="3" class="cell-hint">
          ${n===null?``:`${w(t)} less ${w(n)}`}
        </td>
        <td class="cell-total ${(r??t)<0?`neg`:`pos`}">${w(r??t)}</td>
      </tr>
    </tfoot>`}var ln=`
  <thead>
    <tr>
      <th>Date</th>
      <th>What</th>
      <th class="r">Automatic</th>
      <th class="r">Manual</th>
      <th>Paid from</th>
      <th>Status</th>
    </tr>
  </thead>`;function un(e,t,n){let r=[...e.income,...e.expenses].sort((e,t)=>e.date.localeCompare(t.date)),i=r.length?r.map(e=>sn(e,t,n)).join(``):`<tr><td colspan="6" class="empty">Nothing scheduled in this window.</td></tr>`;return`
    <section class="window-section">
      <header class="ws-header">
        <h3>${E(e.start)}</h3>
        <span class="ws-range">${T(e.start)} – ${T(e.end)}</span>
        <span class="ws-net ${e.planSurplus<0?`neg`:`pos`}">${w(e.planSurplus)}</span>
      </header>
      <div class="table-scroll">
        <table class="ledger">
          ${ln}
          <tbody>${i}</tbody>
          ${cn(e)}
        </table>
      </div>
    </section>`}function dn(e){let{progress:t}=e,n=t.target===null||t.target===0?null:Math.min(100,t.balance/t.target*100),r=[];return t.target===null?r.push(`Set aside, no target`):t.isFunded?r.push(`Fully funded`):(r.push(`${w(t.remaining??0)} to go`),t.requiredPerCycle!==null&&t.requiredPerCycle>0&&r.push(`${w(t.requiredPerCycle)} per cycle`),t.isOverdue&&r.push(`target date passed`)),`
    <article class="pot${t.isOverdue?` pot-overdue`:``}">
      <div class="pot-head">
        <h4><button type="button" class="label-edit" data-edit-pot="${D(e.id)}"
          title="Edit ${D(e.name)}">${D(e.name)}</button></h4>
        <span class="pot-balance">${w(t.balance)}${t.target===null?``:` <span class="pot-target">of ${w(t.target)}</span>`}</span>
      </div>
      ${n===null?``:`<div class="pot-bar"><span style="width:${n.toFixed(1)}%"></span></div>`}
      <p class="pot-detail">${r.join(` · `)}</p>
    </article>`}function fn(e,t,n){return e.length===0?``:`
    <section class="window-section">
      <header class="ws-header">
        <h3>Further ahead</h3>
        <span class="ws-range">Beyond the cycles above</span>
      </header>
      <div class="table-scroll">
        <table class="ledger">${ln}<tbody>${e.slice(0,8).map(e=>sn(e,t,n)).join(``)}</tbody></table>
      </div>
    </section>`}function pn(e,t){let{budgetName:n,today:r,mode:i,saveState:a,theme:o,settings:s}=t,c=Xt(e,i),l=Zt(e,c);return`
    <header class="app-header">
      <div>
        <h1>Fortify</h1>
        <p class="subtitle">${D(n)} · ${E(r)}</p>
      </div>
      <div class="header-actions">
        ${Yt(a)}
        <button class="ghost-btn" id="themeBtn" type="button"
          title="Switch to ${o===`dark`?`light`:`dark`} mode">
          ${o===`dark`?`Light`:`Dark`} mode
        </button>
        <button class="ghost-btn" id="newBudgetBtn" type="button">New budget</button>
        <button class="ghost-btn" id="settingsBtn" type="button">Settings</button>
        <button class="ghost-btn" id="exportBtn" type="button">Export</button>
        <button class="ghost-btn" id="importBtn" type="button">Import</button>
        <span class="prototype-badge">Prototype</span>
      </div>
    </header>

    <section class="runway">
      ${$t(e,c)}
      <p class="runway-figure ${l<0?`neg`:``}">${w(l)}</p>
      <p class="runway-caption">${Qt(e,c)}</p>
      ${nn(e)}
      ${en(e,s.mainBalance,s.balanceAsOf,r)}
    </section>

    <section class="windows">
      ${e.windows.map((e,t)=>rn(e,t===0)).join(``)}
    </section>

    ${`<section class="pots"><div class="section-head"><h2>Savings pots</h2>
        <button type="button" class="ghost-btn" id="addPot">Add a pot</button></div><div class="pot-grid">${e.pots.length?e.pots.map(dn).join(``):`<p class="empty-note">No savings pots yet. A pot holds money set aside for something later — a rego bill, Christmas.</p>`}</div></section>`}

    <section class="detail">
      <div class="section-head">
        <h2>Spend plan</h2>
        <button type="button" class="ghost-btn" id="addGenerator">Add income or bill</button>
      </div>
      ${e.windows.map(t=>un(t,e.windows,e.pots)).join(``)}
      ${fn(e.upcomingBeyond,e.windows,e.pots)}
    </section>

    ${tn(t,s)}`}var mn=`fortify.theme`;function hn(){try{let e=localStorage.getItem(mn);return e===`light`||e===`dark`?e:null}catch{return null}}function gn(e){try{localStorage.setItem(mn,e)}catch{}}function _n(){return window.matchMedia?.(`(prefers-color-scheme: light)`).matches?`light`:`dark`}function vn(){return hn()??_n()}function I(e){document.documentElement.dataset.theme=e}function yn(e){gn(e),I(e)}function bn(e){window.matchMedia?.(`(prefers-color-scheme: light)`).addEventListener(`change`,()=>{hn()===null&&e(_n())})}var xn=4,L=document.querySelector(`#app`),R=m(),z=Ct(R),B=!1,Sn=`safe`,V={kind:`saving`},H=null,U=vn(),W=null,G=null,K=null,q=null,J=null,Y=null;function X(e,t={}){H!==null&&Bt(H,{event:e,at:new Date().toISOString(),...t})}function Cn(e){return e instanceof Error?e.message:String(e)}async function wn(){if(H!==null){V={kind:`saving`};try{await Rt(H,z),V={kind:`saved`,at:new Date().toLocaleTimeString()}}catch(e){V={kind:`error`,message:Cn(e)}}$()}}function Z(e){z=e,$(),wn()}async function Tn(){if(H===null)return;let e=await Vt(H),t=new Blob([Jt(e)],{type:`application/json`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`fortify-usage-${R}.json`,r.click(),URL.revokeObjectURL(n)}async function En(){H!==null&&window.confirm(`Delete the usage log? Your budget is not affected.`)&&(await Ht(H),window.alert(`Usage log deleted.`))}function Dn(){let e=new Blob([jt(z)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=Mt(z,R),n.click(),URL.revokeObjectURL(t)}function On(){let e=document.createElement(`input`);e.type=`file`,e.accept=`application/json,.json`,e.addEventListener(`change`,()=>{let t=e.files?.[0];if(t===void 0)return;let n=new FileReader;n.onload=()=>{let e=At(String(n.result));if(!e.ok){window.alert(`Couldn't import that file.\n\n${e.error}`);return}window.confirm(`Replace your current budget with "${e.budget.name}"?\n\nEverything currently in Fortify will be overwritten.`)&&(X(`imported`),Z(e.budget))},n.onerror=()=>window.alert(`Couldn't read that file.`),n.readAsText(t)}),e.click()}function kn(e){let t=t=>e.querySelector(`#${t}`)?.value??``,n=t(`setAnchor`),r=t(`setCadence`),i=n!==``&&(n!==z.anchorDate||r!==z.anchorCadence);if(i&&yt(z)&&!window.confirm(`Changing your pay cycle clears anything tied to a particular cycle — living expense estimates, savings contributions, and bills you assigned to a specific pay.

Your income, bills and pots are kept. Continue?`))return;X(`settings_saved`);let a=ht(z,t(`setName`));a=gt(a,t(`setBuffer`)),i&&(a=St(a,n,r)),Z(a)}function An(){let e=document.querySelector(`#generatorDialog`);e!==null&&W!==null&&(W={...W,draft:k(e,W.draft)}),$()}function jn(e){let t=z.generators.find(t=>t.id===e);G=null,W=t===void 0?{draft:{...Be(R),id:S(`gen`)},isNew:!0}:{draft:Ve(t,R),isNew:!1},$()}function Mn(){W=null,G=null,$()}function Nn(){let e=document.querySelector(`#generatorDialog`);if(e===null||W===null)return;let t=k(e,W.draft),n=He(t);if(!n.ok){W={...W,draft:t},G=n.error,$();return}X(W.isNew?`entry_added`:`entry_edited`);let r=W.isNew?je(z,n.generator):Me(z,n.generator);W=null,G=null,Z(r)}function Pn(){if(W===null||W.isNew)return;let e=W.draft.label||`this entry`;if(!window.confirm(`Delete ${e}? Every occurrence of it goes too.`))return;X(`entry_deleted`);let t=Ne(z,W.draft.id);W=null,Z(t)}function Fn(){let e=document.querySelector(`#generatorDialog`);if(e===null||W===null)return;e.open||e.showModal();let t=e.querySelector(`#genError`);t!==null&&G!==null&&(t.textContent=G,t.hidden=!1),e.querySelectorAll(`input[name="genKind"], input[name="genAmountKind"]`).forEach(e=>e.addEventListener(`change`,An)),e.querySelector(`#addInstalment`)?.addEventListener(`click`,()=>{if(W===null)return;let t=k(e,W.draft);W={...W,draft:{...t,instalments:[...t.instalments,{date:R,amount:``}]}},$()}),e.querySelectorAll(`[data-inst-remove]`).forEach(t=>{t.addEventListener(`click`,()=>{if(W===null)return;let n=Number(t.dataset.instRemove),r=k(e,W.draft);W={...W,draft:{...r,instalments:r.instalments.filter((e,t)=>t!==n)}},$()})}),e.querySelector(`#genSave`)?.addEventListener(`click`,Nn),e.querySelector(`#genCancel`)?.addEventListener(`click`,Mn),e.querySelector(`#genDelete`)?.addEventListener(`click`,Pn),e.addEventListener(`cancel`,e=>{e.preventDefault(),Mn()})}function In(e){let t=z.pots.find(t=>t.id===e);q=null,K=t===void 0?{draft:{...Ze(R),id:S(`pot`)},isNew:!0}:{draft:Qe(t,R),isNew:!1},$()}function Ln(){let e=document.querySelector(`#potDialog`);if(e===null||K===null)return;let t=nt(e,K.draft),n=$e(t,R);if(!n.ok){K={...K,draft:t},q=n.error,$();return}X(K.isNew?`pot_added`:`pot_edited`);let r=K.isNew?Pe(z,n.pot):Fe(z,n.pot);K=null,q=null,Z(r)}function Rn(){if(K===null||K.isNew)return;let e=K.draft.name||`this pot`;if(!window.confirm(`Delete ${e}? Anything paid from it goes back to being paid from its own pay cycle.`))return;X(`pot_deleted`);let t=Le(z,K.draft.id);K=null,Z(t)}function zn(){let e=document.querySelector(`#potDialog`);if(e===null||K===null)return;e.open||e.showModal();let t=e.querySelector(`#potError`);t!==null&&q!==null&&(t.textContent=q,t.hidden=!1),e.querySelectorAll(`input[name="potMode"]`).forEach(t=>t.addEventListener(`change`,()=>{K!==null&&(K={...K,draft:nt(e,K.draft)},$())})),e.querySelector(`#potSave`)?.addEventListener(`click`,Ln),e.querySelector(`#potCancel`)?.addEventListener(`click`,()=>{K=null,q=null,$()}),e.querySelector(`#potDelete`)?.addEventListener(`click`,Rn),e.addEventListener(`cancel`,e=>{e.preventDefault(),K=null,q=null,$()})}function Bn(){return!L||J===null?null:pt(L,J)}function Vn(e){let t=Bn();if(t!==null){if(e>0){let e=at(t,t.step);if(e!==null){J=t,Y=e,$();return}}if(e>0&&t.step===3){J=null,Y=null,X(`setup_completed`),Z(st(t,R));return}J={...t,step:Math.max(1,t.step+e)},Y=null,$()}}function Hn(){!L||J===null||(L.innerHTML=ft(J,Y),L.querySelectorAll(`input, select`).forEach(e=>{e.addEventListener(`change`,()=>{let e=Bn();e!==null&&(J=e,$())})}),L.querySelector(`#wizNext`)?.addEventListener(`click`,()=>{Vn(1)}),L.querySelector(`#wizBack`)?.addEventListener(`click`,()=>{Vn(-1)}),L.querySelector(`#wizSample`)?.addEventListener(`click`,()=>{J=null,Y=null,X(`sample_loaded`),Z(Ct(R))}))}function Q(){return x(R,z.anchorDate,z.anchorCadence)}function $(){if(!L||!B)return;if(J!==null){Hn();return}L.innerHTML=pn(Ae(z,R,xn),{budgetName:z.name,today:R,mode:Sn,saveState:V,theme:U,settings:{name:z.name,anchorDate:z.anchorDate,anchorCadence:z.anchorCadence,safetyBuffer:z.safetyBuffer,mainBalance:z.mainBalance?.amount??null,balanceAsOf:z.mainBalance?.asOfDateTime.slice(0,10)??null}}),W!==null&&L.insertAdjacentHTML(`beforeend`,Je(W.draft,W.isNew)),K!==null&&L.insertAdjacentHTML(`beforeend`,tt(K.draft,K.isNew,Re(z,K.draft.id))),L.querySelectorAll(`.mode-tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.mode;(t===`plan`||t===`safe`||t===`expected`)&&(Sn=t,X(`mode_viewed_${t}`,{cycleIndex:Q()}),$())})}),L.querySelectorAll(`.assign`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.entry;t!==void 0&&(X(`funding_changed`,{cycleIndex:Q()}),Z(s(z,t,e.value)))})}),L.querySelectorAll(`.amount-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.entry;t!==void 0&&(X(`amount_entered`,{cycleIndex:Q()}),Z(c(z,t,e.value)))})}),L.querySelectorAll(`.living-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.window);Number.isInteger(t)&&(X(`living_set`,{cycleIndex:t}),Z(u(z,t,e.value)))})}),L.querySelectorAll(`.contrib-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.window),n=e.dataset.pot;!Number.isInteger(t)||n===void 0||(X(`contribution_set`,{cycleIndex:t}),Z(d(z,t,n,e.value)))})}),L.querySelectorAll(`[data-paid]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.paid;t!==void 0&&(X(e.checked?`marked_paid`:`unmarked_paid`,{cycleIndex:Q()}),Z(l(z,t,e.checked,R)))})}),L.querySelector(`#balanceInput`)?.addEventListener(`change`,e=>{let t=e.currentTarget;X(`balance_updated`,{cycleIndex:Q()}),Z(_t(z,t.value,R))}),L.querySelector(`#balanceDate`)?.addEventListener(`change`,e=>{let t=e.currentTarget;Z(vt(z,t.value,R))});let e=L.querySelector(`#settingsDialog`);L.querySelector(`#settingsBtn`)?.addEventListener(`click`,()=>{e?.showModal()}),L.querySelector(`#newBudgetBtn`)?.addEventListener(`click`,()=>{window.confirm(`Start a new budget? This replaces what is here now, so export a backup first if you want to keep it.`)&&(J=it(R),Y=null,$())}),e?.addEventListener(`close`,()=>{e.returnValue===`save`&&kn(e)}),L.querySelector(`#themeBtn`)?.addEventListener(`click`,()=>{U=U===`dark`?`light`:`dark`,yn(U),$()}),L.querySelector(`#exportBtn`)?.addEventListener(`click`,()=>{X(`exported`),Dn()}),L.querySelector(`#importBtn`)?.addEventListener(`click`,On),L.querySelector(`#usageDownload`)?.addEventListener(`click`,()=>{Tn()}),L.querySelector(`#usageClear`)?.addEventListener(`click`,()=>{En()}),L.querySelector(`#addGenerator`)?.addEventListener(`click`,()=>{jn(null)}),L.querySelectorAll(`[data-edit-generator]`).forEach(e=>{e.addEventListener(`click`,()=>{jn(e.dataset.editGenerator??null)})}),L.querySelector(`#addPot`)?.addEventListener(`click`,()=>{In(null)}),L.querySelectorAll(`[data-edit-pot]`).forEach(e=>{e.addEventListener(`click`,()=>{In(e.dataset.editPot??null)})}),Fn(),zn()}async function Un(){I(U),bn(e=>{U=e,I(e),$()});try{H=await Lt();let e=await zt(H);if(e===null){J=it(R),B=!0,X(`setup_started`),$();return}z=e,V={kind:`saved`,at:new Date().toLocaleTimeString()};let t=e.mainBalance===null?void 0:Math.max(0,y(e.mainBalance.asOfDateTime.slice(0,10),R));X(`opened`,{cycleIndex:x(R,e.anchorDate,e.anchorCadence),...t===void 0?{}:{balanceAgeDays:t}})}catch(e){V={kind:`unavailable`,message:Cn(e)}}B=!0,$()}Un();