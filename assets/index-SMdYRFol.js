(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){if(e===`external`)return{kind:`external`};let[t,n]=e.split(`:`);if(t===`window`&&n!==void 0){let e=Number(n);return Number.isInteger(e)?{kind:`window`,index:e}:null}return t===`pot`&&n!==void 0&&n!==``?{kind:`pot`,potId:n}:null}function t(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function n(e){let t=e.lastIndexOf(`::`);return t===-1?null:{generatorId:e.slice(0,t),date:e.slice(t+2)}}function r(e,t){let n={...e,...t};for(let[e,r]of Object.entries(t))r===void 0&&delete n[e];return n}function i(e,t,n){return e.find(e=>e.date===t)===void 0?[...e,r({date:t},n)]:e.map(e=>e.date===t?r(e,n):e)}function a(e,t,n){switch(e.kind){case`recurring`:return{...e,overrides:i(e.overrides??[],t,n)};case`irregular`:return{...e,dates:e.dates.map(e=>e.date===t?r(e,n):e)};case`one-off`:return r(e,n)}}function o(e,t,r){let i=n(t);return i===null||!e.generators.some(e=>e.id===i.generatorId)?e:{...e,generators:e.generators.map(e=>e.id===i.generatorId?a(e,i.date,r):e)}}function s(t,n,r){let i=e(r);return i===null?t:o(t,n,{fundedFrom:i})}function c(e,t,n){let r=n.trim();if(r===``)return o(e,t,{amount:void 0});let i=Number(r);return!Number.isFinite(i)||i<0?e:o(e,t,{amount:i})}function l(e,t,n,r){return o(e,t,{paid:n,paidOn:n?r:void 0})}function u(e,n,r){let i=String(n),a={...e.livingEstimates},o=t(r);return o===null?delete a[i]:a[i]=o,{...e,livingEstimates:a}}function d(e,n,r,i){let a=String(n),o=t(i),s={...e.potContributions[a]??{}};o===null||o===0?delete s[r]:s[r]=o;let c={...e.potContributions};return Object.keys(s).length===0?delete c[a]:c[a]=s,{...e,potContributions:c}}function f(e){return String(e).padStart(2,`0`)}function p(e){return`${e.getUTCFullYear()}-${f(e.getUTCMonth()+1)}-${f(e.getUTCDate())}`}function m(e=new Date){return`${e.getFullYear()}-${f(e.getMonth()+1)}-${f(e.getDate())}`}function h(e){let[t,n,r]=e.split(`-`).map(Number);if(t===void 0||n===void 0||r===void 0)throw Error(`Invalid ISO date: "${e}"`);return new Date(Date.UTC(t,n-1,r))}function g(e,t){let n=h(e);return n.setUTCDate(n.getUTCDate()+t),p(n)}function _(e,t,n){return e>=t&&e<=n}var v=864e5;function ee(e,t){return Math.round((h(t).getTime()-h(e).getTime())/v)}function te(e,t){let n=h(e),r=n.getUTCDate(),i=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+t,1)),a=new Date(Date.UTC(i.getUTCFullYear(),i.getUTCMonth()+1,0)).getUTCDate();return i.setUTCDate(Math.min(r,a)),p(i)}function ne(e,t,n,r,i){return e.filter(e=>e.entryType===t&&n.includes(e.status)&&_(e.date,r,i)).reduce((e,t)=>e+t.amount,0)}function re(e,t,n,r){return e.filter(e=>e.entryType===`income`&&t.includes(e.status)&&e.date>n&&e.date<=r).reduce((e,t)=>e+t.amount,0)}function ie(e){return e.paidOn??e.date}function ae(e,t,n,r){return e.filter(e=>e.entryType===`expense`&&t.includes(e.status)&&ie(e)>r&&n(e)).reduce((e,t)=>e+t.amount,0)}function oe(e,t,n){return ne(e,`income`,[`confirmed`,`expected`],t,n)-ne(e,`expense`,[`confirmed`,`expected`],t,n)}function se(e,t,n,r,i){let a=re(t,[`received`,`confirmed`],e.asOfDateTime,n),o=ae(t,[`received`,`confirmed`],i,e.asOfDateTime);return e.amount+a-o-r}function ce(e,t,n,r,i){let a=se(e,t,n,r,i),o=re(t,[`expected`],e.asOfDateTime,n),s=ae(t,[`expected`],i,e.asOfDateTime);return a+o-s}function le(e,t){return ee(e.asOfDateTime.slice(0,10),t)}function ue(e){let{balance:t,entries:n,cycleStart:r,horizon:i,safetyBuffer:a,today:o,isOutstandingHere:s,potContributions:c}=e,l=n.filter(e=>e.status===`expected`&&_(e.date,o,i)).length,u=e=>e-c;return{plan:oe(n,r,i)-c,conservative:t===null?null:u(se(t,n,i,a,s)),expected:t===null?null:u(ce(t,n,i,a,s)),hasBalance:t!==null,balanceAgeDays:t===null?null:le(t,o),unconfirmedCount:l,nextAnchorDate:i,safetyBuffer:a,potsIncluded:!1,potContributions:c}}var de={weekly:7,fortnightly:14,"four-weekly":28};function y(e,t,n){return t===`monthly`?te(e,n):g(e,de[t]*n)}function b(e,t,n,r){let i=[];for(let a=0;a<r;a+=1){let r=n+a,o=y(e,t,r),s=y(e,t,r+1);i.push({index:r,start:o,end:g(s,-1)})}return i}function x(e,t,n){if(n!==`monthly`)return Math.floor(ee(t,e)/de[n]);let r=h(t),i=h(e),a=(i.getUTCFullYear()-r.getUTCFullYear())*12+(i.getUTCMonth()-r.getUTCMonth());for(;e<y(t,n,a);)--a;for(;e>=y(t,n,a+1);)a+=1;return a}function S(e,t,n){return e.fundedFrom??{kind:`window`,index:x(e.date,t,n)}}function fe(e,t){return e.kind===`window`&&e.index===t}function pe(e,t,n){return e.kind===`external`?`Paid elsewhere`:e.kind===`pot`?t.find(t=>t.id===e.potId)?.name??`Deleted pot`:e.index<n?`Prepaid`:e.index>n?`Paying ahead`:null}var me=90,he=2e3;function ge(e,t){return(e.amountChanges??[]).filter(e=>e.effectiveFrom<=t).sort((e,t)=>e.effectiveFrom.localeCompare(t.effectiveFrom)).at(-1)?.amount??e.amount}function _e(e,t,n){let r=[];for(let i=0;i<he;i+=1){let a=y(e.startDate,e.frequency,i);if(e.endDate!==void 0&&a>e.endDate||a>n)break;a>=t&&r.push(a)}return r}function ve(e,t,n){let r=_e(e,g(t,-90),g(n,me)),i=[];for(let a of r){let r=e.overrides?.find(e=>e.date===a);if(r?.skipped===!0)continue;let o=r?.movedTo??a;_(o,t,n)&&i.push({id:`${e.id}::${a}`,date:o,amount:r?.amount??ge(e,a),entryType:e.entryType,status:r?.status??e.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`&&r?.amount===void 0,fundedFrom:r?.fundedFrom??null,paidOverride:r?.paid??null,paidOn:r?.paidOn??null})}return i.sort((e,t)=>e.date.localeCompare(t.date))}function ye(e,t,n){switch(e.kind){case`recurring`:return ve(e,t,n);case`irregular`:return e.dates.filter(e=>_(e.date,t,n)).map(t=>({id:`${e.id}::${t.date}`,date:t.date,amount:t.amount,entryType:e.entryType,status:t.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`,fundedFrom:t.fundedFrom??null,paidOverride:t.paid??null,paidOn:t.paidOn??null}));case`one-off`:return _(e.date,t,n)?[{id:`${e.id}::${e.date}`,date:e.date,amount:e.amount,entryType:e.entryType,status:e.status,generatorId:e.id,label:e.label,amountKind:e.amountKind,isEstimate:e.amountKind===`variable`,fundedFrom:e.fundedFrom??null,paidOverride:e.paid??null,paidOn:e.paidOn??null}]:[]}}var be=1e3;function xe(e,t,n){let r=0;for(;r<be&&!(y(e,n,r+1)>t);)r+=1;return r}function Se(e,t,n){let r=e.balance?.amount??0,i=e.targetAmount;if(i===null)return{balance:r,target:null,remaining:null,cyclesRemaining:null,requiredPerCycle:null,isFunded:!1,isOverdue:!1};let a=Math.max(0,i-r),o=a===0,s=e.targetDate!==null&&e.targetDate<t&&!o,c=e.targetDate===null?null:xe(t,e.targetDate,n),l=null;return e.mode===`active`&&(l=o?0:c===null?null:c===0?a:a/c),{balance:r,target:i,remaining:a,cyclesRemaining:c,requiredPerCycle:l,isFunded:o,isOverdue:s}}function Ce(e,t){return e.paidOverride===null?e.status===`received`||e.amountKind===`fixed`&&e.date<t:e.paidOverride}function we(e,t){return Ce(e,t)?e.entryType===`income`?`Received`:`Paid`:e.status===`expected`?`Expected`:`Upcoming`}var Te=400;function Ee(e,t){return e.filter(e=>t.includes(e.status)).reduce((e,t)=>e+t.amount,0)}function De(e){return e.reduce((e,t)=>e+t.amount,0)}function Oe(e){let t=new Map;for(let n of e){let e=t.get(n.generatorId);(e===void 0||n.date<e.date)&&t.set(n.generatorId,n)}return[...t.values()].sort((e,t)=>e.date.localeCompare(t.date))}function ke(e,t,n){let r=x(t,e.anchorDate,e.anchorCadence),i=b(e.anchorDate,e.anchorCadence,r,n),a=i[0]?.start??t,o=i.at(-1)?.end??t,s=g(o,Te),c=e.pots.map(e=>({id:e.id,name:e.name})),l=e.generators.flatMap(e=>ye(e,a,s)).map(n=>{let r=S(n,e.anchorDate,e.anchorCadence),i=x(n.date,e.anchorDate,e.anchorCadence);return{...n,funding:r,dueWindowIndex:i,isSettled:Ce(n,t),statusLabel:we(n,t),fundingNote:n.entryType===`expense`?pe(r,c,i):null}}),u=i.map(n=>{let r=l.filter(e=>_(e.date,n.start,n.end)),i=r.filter(e=>e.entryType===`income`),a=r.filter(e=>e.entryType===`expense`),o=l.filter(e=>e.entryType===`expense`&&fe(e.funding,n.index)),s=Ee(i,[`received`,`confirmed`]),c=Ee(i,[`expected`]),u=De(o.filter(e=>e.amountKind===`fixed`)),d=De(o.filter(e=>e.amountKind===`variable`)),f=u+d,p=e.potContributions[String(n.index)]??{},m=e.pots.map(e=>({potId:e.id,name:e.name,amount:p[e.id]??0})),h=m.reduce((e,t)=>e+t.amount,0),g=s+c-f-h,v=e.livingEstimates[String(n.index)]??null;return{...n,isCurrent:_(t,n.start,n.end),income:i,expenses:a,confirmedIncome:s,expectedIncome:c,fixedExpenses:u,variableExpenses:d,chargedExpenses:f,contributions:m,totalContributions:h,planSurplus:g,livingEstimate:v,leftAfterLiving:v===null?null:g-v}}),d=u[0]?.end??t,f=u[0]?.index??r;return{windows:u,summary:ue({balance:e.mainBalance,entries:l,cycleStart:u[0]?.start??t,horizon:d,safetyBuffer:e.safetyBuffer,today:t,isOutstandingHere:t=>fe(S(t,e.anchorDate,e.anchorCadence),f),potContributions:u[0]?.totalContributions??0}),pots:e.pots.map(n=>({...n,progress:Se(n,t,e.anchorCadence)})),upcomingBeyond:Oe(l.filter(e=>e.date>o))}}function C(e){return`${e}-${typeof crypto<`u`&&`randomUUID`in crypto?crypto.randomUUID().slice(0,8):Math.random().toString(36).slice(2,10)}`}function Ae(e,t){return{...e,generators:[...e.generators,t]}}function je(e,t){return e.generators.some(e=>e.id===t.id)?{...e,generators:e.generators.map(e=>e.id===t.id?t:e)}:e}function Me(e,t){return e.generators.some(e=>e.id===t)?{...e,generators:e.generators.filter(e=>e.id!==t)}:e}function Ne(e,t){return{...e,pots:[...e.pots,t]}}function Pe(e,t){return e.pots.some(e=>e.id===t.id)?{...e,pots:e.pots.map(e=>e.id===t.id?t:e)}:e}function Fe(e,t){let n=e=>{if(e.fundedFrom?.kind!==`pot`||e.fundedFrom.potId!==t)return e;let{fundedFrom:n,...r}=e;return r};switch(e.kind){case`recurring`:return e.overrides===void 0?e:{...e,overrides:e.overrides.map(n)};case`irregular`:return{...e,dates:e.dates.map(n)};case`one-off`:return n(e)}}function Ie(e,t){if(!e.pots.some(e=>e.id===t))return e;let n={};for(let[r,i]of Object.entries(e.potContributions)){let{[t]:e,...a}=i;Object.keys(a).length>0&&(n[r]=a)}return{...e,pots:e.pots.filter(e=>e.id!==t),potContributions:n,generators:e.generators.map(e=>Fe(e,t))}}function Le(e,t){let n=0;for(let r of e.generators)switch(r.kind){case`recurring`:n+=(r.overrides??[]).filter(e=>e.fundedFrom?.kind===`pot`&&e.fundedFrom.potId===t).length;break;case`irregular`:n+=r.dates.filter(e=>e.fundedFrom?.kind===`pot`&&e.fundedFrom.potId===t).length;break;case`one-off`:r.fundedFrom?.kind===`pot`&&r.fundedFrom.potId===t&&(n+=1)}let r=Object.values(e.potContributions).filter(e=>e[t]!==void 0).length;return{fundedEntries:n,contributedCycles:r}}var w=/^\d{4}-\d{2}-\d{2}$/;function T(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function Re(e){return{id:``,label:``,entryType:`expense`,amountKind:`fixed`,kind:`recurring`,status:`confirmed`,amount:``,frequency:`monthly`,startDate:e,endDate:``,date:e,instalments:[{date:e,amount:``}]}}function ze(e,t){let n={...Re(t),id:e.id,label:e.label,entryType:e.entryType,amountKind:e.amountKind,kind:e.kind};switch(e.kind){case`recurring`:return{...n,status:e.status,amount:String(e.amount),frequency:e.frequency,startDate:e.startDate,endDate:e.endDate??``};case`one-off`:return{...n,status:e.status,amount:String(e.amount),date:e.date};case`irregular`:return{...n,instalments:e.dates.map(e=>({date:e.date,amount:String(e.amount)}))}}}function Be(e){let t=e.label.trim();if(t===``)return{ok:!1,error:`Give it a name so you can recognise it.`};let n={id:e.id,label:t,entryType:e.entryType,amountKind:e.amountKind};if(e.kind===`irregular`){let t=e.instalments.filter(e=>e.date.trim()!==``||e.amount.trim()!==``);if(t.length===0)return{ok:!1,error:`Add at least one instalment, with a date and an amount.`};let r=[];for(let n of t){let t=T(n.amount);if(!w.test(n.date))return{ok:!1,error:`Every instalment needs a date.`};if(t===null)return{ok:!1,error:`Every instalment needs an amount of zero or more.`};r.push({date:n.date,amount:t,status:e.status})}return{ok:!0,generator:{...n,kind:`irregular`,dates:r.sort((e,t)=>e.date.localeCompare(t.date))}}}let r=T(e.amount);if(r===null)return{ok:!1,error:e.amountKind===`variable`?`Give a typical amount to estimate with — you can correct it each time.`:`Enter an amount of zero or more.`};if(e.kind===`one-off`)return w.test(e.date)?{ok:!0,generator:{...n,kind:`one-off`,date:e.date,amount:r,status:e.status}}:{ok:!1,error:`Pick a date.`};if(!w.test(e.startDate))return{ok:!1,error:`Pick the date this starts from.`};let i=e.endDate.trim();return i!==``&&!w.test(i)?{ok:!1,error:`That end date isn't a real date.`}:i!==``&&i<e.startDate?{ok:!1,error:`It can't end before it starts.`}:{ok:!0,generator:{...n,kind:`recurring`,frequency:e.frequency,amount:r,startDate:e.startDate,status:e.status,...i===``?{}:{endDate:i}}}}var Ve=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`],He=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`];function E(e){return`${e<0?`-`:``}$${Math.abs(e).toLocaleString(`en-AU`,{minimumFractionDigits:2,maximumFractionDigits:2})}`}function D(e){let[t,n,r]=e.split(`-`).map(Number);return t===void 0||n===void 0||r===void 0?e:`${r} ${Ve[n-1]}`}function O(e){let[t,n,r]=e.split(`-`).map(Number);return t===void 0||n===void 0||r===void 0?e:`${He[new Date(Date.UTC(t,n-1,r)).getUTCDay()]} ${r} ${Ve[n-1]}`}function Ue(e){return e===0?`today`:e===1?`1 day ago`:`${e} days ago`}function k(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}var We=[[`recurring`,`Repeats`,`Same thing every week, fortnight or month`],[`one-off`,`Just once`,`A single dated payment`],[`irregular`,`Split into instalments`,`One cost spread over several dates`]],Ge=[[`weekly`,`Every week`],[`fortnightly`,`Every fortnight`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Every month`]];function A(e,t,n){return`<div class="radio-row">
    ${n.map(([n,r,i])=>`
        <label class="radio-card${t===n?` selected`:``}">
          <input type="radio" name="${e}" value="${n}"${t===n?` checked`:``}>
          <span class="radio-label">${r}</span>
          ${i===void 0?``:`<span class="radio-hint">${i}</span>`}
        </label>`).join(``)}
  </div>`}function Ke(e,t){let n=e.amountKind===`variable`;return`
    <dialog id="generatorDialog" class="dialog dialog-wide">
      <div class="dialog-body">
        <h2>${t?`Add income or a bill`:`Edit ${k(e.label||`entry`)}`}</h2>

        <label class="field">
          <span>What is it</span>
          <input type="text" id="genLabel" value="${k(e.label)}"
            placeholder="Rent, Salary, Power…" maxlength="60" autocomplete="off">
        </label>

        <div class="field">
          <span>Money in or out</span>
          ${A(`genType`,e.entryType,[[`income`,`Money in`],[`expense`,`Money out`]])}
        </div>

        <div class="field">
          <span>Is the amount the same every time</span>
          ${A(`genAmountKind`,e.amountKind,[[`fixed`,`Always the same`,`Rent, a subscription`],[`variable`,`Changes each time`,`Power, a credit card`]])}
        </div>

        <div class="field">
          <span>When</span>
          ${A(`genKind`,e.kind,We)}
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
                      value="${k(t.amount)}" placeholder="0.00">
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
                value="${k(e.amount)}" placeholder="0.00">
            </span>
            ${n?`<small>Used as the estimate until you enter the real figure each time.</small>`:``}
          </label>`}

        ${e.kind===`recurring`?`
          <label class="field">
            <span>How often</span>
            <select id="genFrequency">
              ${Ge.map(([t,n])=>`<option value="${t}"${e.frequency===t?` selected`:``}>${n}</option>`).join(``)}
            </select>
          </label>
          <div class="field-pair">
            <label class="field">
              <span>First one on</span>
              <input type="date" id="genStart" value="${e.startDate}">
            </label>
            <label class="field">
              <span>Stops after (optional)</span>
              <input type="date" id="genEnd" value="${k(e.endDate)}">
            </label>
          </div>`:``}

        ${e.kind===`one-off`?`
          <label class="field">
            <span>Date</span>
            <input type="date" id="genDate" value="${e.date}">
          </label>`:``}

        <div class="field">
          <span>How sure are you</span>
          ${A(`genStatus`,e.status,[[`confirmed`,`Confirmed`,`It is definitely happening`],[`expected`,`Expected`,`Likely, but not locked in`]])}
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
    </dialog>`}function j(e,t){let n=t=>e.querySelector(t),r=(t,n)=>e.querySelector(`input[name="${t}"]:checked`)?.value??n,i=[...e.querySelectorAll(`.instalment-row`)].map(e=>({date:e.querySelector(`[data-inst-date]`)?.value??``,amount:e.querySelector(`[data-inst-amount]`)?.value??``}));return{...t,label:n(`#genLabel`)?.value??t.label,entryType:r(`genType`,t.entryType),amountKind:r(`genAmountKind`,t.amountKind),kind:r(`genKind`,t.kind),status:r(`genStatus`,t.status),amount:n(`#genAmount`)?.value??t.amount,frequency:n(`#genFrequency`)?.value??t.frequency,startDate:n(`#genStart`)?.value??t.startDate,endDate:n(`#genEnd`)?.value??t.endDate,date:n(`#genDate`)?.value??t.date,instalments:i.length>0?i:t.instalments}}var qe=/^\d{4}-\d{2}-\d{2}$/;function Je(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function Ye(e){return{id:``,name:``,balance:``,balanceAsOf:e,targetAmount:``,targetDate:``,mode:`passive`}}function Xe(e,t){return{id:e.id,name:e.name,balance:e.balance===null?``:String(e.balance.amount),balanceAsOf:e.balance?.asOfDateTime.slice(0,10)??t,targetAmount:e.targetAmount===null?``:String(e.targetAmount),targetDate:e.targetDate??``,mode:e.mode}}function Ze(e,t){let n=e.name.trim();if(n===``)return{ok:!1,error:`Give the pot a name.`};let r=Je(e.balance);if(e.balance.trim()!==``&&r===null)return{ok:!1,error:`That balance isn't a number of zero or more.`};let i=e.balanceAsOf.trim();if(r!==null&&!qe.test(i))return{ok:!1,error:`Pick the date this pot balance was read.`};let a=i>t?t:i,o=Je(e.targetAmount);if(e.targetAmount.trim()!==``&&o===null)return{ok:!1,error:`That target isn't a number of zero or more.`};let s=e.targetDate.trim();return s!==``&&!qe.test(s)?{ok:!1,error:`That target date isn't a real date.`}:e.mode===`active`&&(o===null||s===``)?{ok:!1,error:`To work out how much to put away each pay, this needs both a target amount and a date to reach it by.`}:{ok:!0,pot:{id:e.id,name:n,balance:r===null?null:{amount:r,asOfDateTime:a},targetAmount:o,targetDate:s===``?null:s,mode:e.mode}}}function Qe(e){let t=[];return e.fundedEntries>0&&t.push(`${e.fundedEntries} ${e.fundedEntries===1?`bill is`:`bills are`} paid from it`),e.contributedCycles>0&&t.push(`${e.contributedCycles} pay ${e.contributedCycles===1?`cycle puts`:`cycles put`} money in`),t.length===0?``:`<p class="dialog-note">Deleting this pot: ${t.join(`, `)}. Those bills go back to
    being paid from the cycle they fall in.</p>`}function $e(e,t,n){let r=e.mode===`active`;return`
    <dialog id="potDialog" class="dialog">
      <div class="dialog-body">
        <h2>${t?`Add a savings pot`:`Edit ${k(e.name||`pot`)}`}</h2>

        <label class="field">
          <span>What is it for</span>
          <input type="text" id="potName" value="${k(e.name)}"
            placeholder="Car rego, Christmas, Future bills…" maxlength="60" autocomplete="off">
        </label>

        <div class="field-pair">
          <label class="field">
            <span>How much is in it</span>
            <span class="balance-input-wrap">
              <span class="currency">$</span>
              <input type="number" id="potBalance" step="0.01" min="0"
                value="${k(e.balance)}" placeholder="0.00">
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
                value="${k(e.targetAmount)}" placeholder="0.00">
            </span>
          </label>
          <label class="field">
            <span>Needed by${r?``:` (optional)`}</span>
            <input type="date" id="potTargetDate" value="${k(e.targetDate)}">
          </label>
        </div>

        ${t?``:Qe(n)}
        <p class="dialog-error" id="potError" hidden></p>

        <div class="dialog-actions">
          ${t?``:`<button type="button" class="danger-btn" id="potDelete">Delete</button>`}
          <span class="spacer"></span>
          <button type="button" class="ghost-btn" id="potCancel">Cancel</button>
          <button type="button" class="primary-btn" id="potSave">${t?`Add`:`Save`}</button>
        </div>
      </div>
    </dialog>`}function et(e,t){let n=t=>e.querySelector(`#${t}`)?.value;return{...t,name:n(`potName`)??t.name,balance:n(`potBalance`)??t.balance,balanceAsOf:n(`potBalanceAsOf`)??t.balanceAsOf,targetAmount:n(`potTarget`)??t.targetAmount,targetDate:n(`potTargetDate`)??t.targetDate,mode:e.querySelector(`input[name="potMode"]:checked`)?.value??t.mode}}var tt=/^\d{4}-\d{2}-\d{2}$/;function M(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function nt(e){return{step:1,name:`My budget`,cadence:`fortnightly`,anchorDate:e,incomeLabel:``,incomeAmount:``,balance:``}}function rt(e,t){return t===1?e.name.trim()===``?`Give this budget a name.`:tt.test(e.anchorDate)?null:`Pick a recent payday.`:t===2?e.incomeLabel.trim()===``?`What is this income called?`:M(e.incomeAmount)===null?`How much lands each time? Enter zero or more.`:null:e.balance.trim()!==``&&M(e.balance)===null?`That balance isn't a number of zero or more.`:null}function it(e,t=4){return tt.test(e.anchorDate)?b(e.anchorDate,e.cadence,0,t):[]}function at(e,t){let n={id:C(`gen`),kind:`recurring`,label:e.incomeLabel.trim(),entryType:`income`,amountKind:`fixed`,frequency:e.cadence,amount:M(e.incomeAmount)??0,startDate:e.anchorDate,status:`confirmed`},r=M(e.balance);return{id:C(`budget`),name:e.name.trim(),anchorDate:e.anchorDate,anchorCadence:e.cadence,safetyBuffer:0,livingEstimates:{},potContributions:{},mainBalance:r===null?null:{amount:r,asOfDateTime:t},pots:[],generators:[n]}}var ot=[[`weekly`,`Weekly`],[`fortnightly`,`Fortnightly`],[`four-weekly`,`Every 4 weeks`],[`monthly`,`Monthly`]],st=[``,`When do you get paid?`,`What is your main income?`,`What is in your account right now?`],ct=[``,`Fortify organises everything around your pay cycle rather than the calendar month, so the question it answers is always the same one: will this last until the next payday?`,`The regular one that everything else is planned around. You can add side income, rent and one-off payments once you are set up.`,`This is what turns a forecast into a figure you can actually spend against. You can skip it and add it later.`];function lt(e,t){let n=it(e);if(n.length===0)return``;if(t===1)return`
      <div class="wiz-preview">
        <p class="wiz-preview-label">Your cycles would be</p>
        <ul class="wiz-cycles">
          ${n.map((e,t)=>`
            <li class="${t===0?`is-current`:``}">
              <strong>${O(e.start)}</strong>
              <span>to ${D(e.end)}</span>
            </li>`).join(``)}
        </ul>
      </div>`;let r=Number(e.incomeAmount),i=Number.isFinite(r)&&e.incomeAmount.trim()!==``,a=e.incomeLabel.trim()||`Your income`;if(t===2)return`
      <div class="wiz-preview">
        <p class="wiz-preview-label">Your first cycle would start</p>
        <ul class="wiz-cycles">
          <li class="is-current">
            <strong>${O(n[0]?.start??e.anchorDate)}</strong>
            <span>${k(a)} ${i?`+${E(r)}`:``}</span>
          </li>
        </ul>
        <p class="wiz-preview-note">Repeating every cycle from then on.</p>
      </div>`;let o=Number(e.balance),s=Number.isFinite(o)&&e.balance.trim()!==``;return`
    <div class="wiz-preview">
      <p class="wiz-preview-label">${s?`Safe to spend would start from`:`Without a balance you would see`}</p>
      <p class="wiz-figure">${s?E(o):i?E(r):`—`}</p>
      <p class="wiz-preview-note">
        ${s?`Then adjusted for everything due before ${D(n[0]?.end??e.anchorDate)}.`:`The planned figure only — a forecast from your schedule, not money you have.`}
      </p>
    </div>`}function ut(e,t){let n=e.step;return`
    <div class="wizard">
      <header class="wiz-header">
        <h1>Fortify</h1>
        <p class="wiz-progress">Step ${n} of 3</p>
      </header>

      <div class="wiz-card">
        <div class="wiz-form">
          <h2>${st[n]}</h2>
          <p class="wiz-blurb">${ct[n]}</p>

          ${n===1?`
            <label class="field">
              <span>Name this budget</span>
              <input type="text" id="wizName" value="${k(e.name)}"
                maxlength="60" autocomplete="off">
            </label>
            <label class="field">
              <span>How often you are paid</span>
              <select id="wizCadence">
                ${ot.map(([t,n])=>`<option value="${t}"${e.cadence===t?` selected`:``}>${n}</option>`).join(``)}
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
              <input type="text" id="wizIncomeLabel" value="${k(e.incomeLabel)}"
                placeholder="Salary, Wages, Pension…" maxlength="60" autocomplete="off">
            </label>
            <label class="field">
              <span>How much lands each time</span>
              <span class="balance-input-wrap">
                <span class="currency">$</span>
                <input type="number" id="wizIncomeAmount" step="0.01" min="0"
                  value="${k(e.incomeAmount)}" placeholder="0.00">
              </span>
              <small>Take-home, after tax.</small>
            </label>`:``}

          ${n===3?`
            <label class="field">
              <span>Balance in your spending account</span>
              <span class="balance-input-wrap">
                <span class="currency">$</span>
                <input type="number" id="wizBalance" step="0.01" min="0"
                  value="${k(e.balance)}" placeholder="0.00">
              </span>
              <small>Optional — you can add it any time from the main screen.</small>
            </label>`:``}

          ${t===null?``:`<p class="dialog-error">${k(t)}</p>`}

          <div class="wiz-actions">
            ${n>1?`<button type="button" class="ghost-btn" id="wizBack">Back</button>`:``}
            <span class="spacer"></span>
            <button type="button" class="primary-btn" id="wizNext">
              ${n===3?`Finish`:`Next`}
            </button>
          </div>
        </div>

        ${lt(e,n)}
      </div>

      <p class="wiz-escape">
        Just looking? <button type="button" class="link-btn" id="wizSample">Load an example budget</button>
      </p>
    </div>`}function dt(e,t){let n=t=>e.querySelector(`#${t}`)?.value;return{...t,name:n(`wizName`)??t.name,cadence:n(`wizCadence`)??t.cadence,anchorDate:n(`wizAnchor`)??t.anchorDate,incomeLabel:n(`wizIncomeLabel`)??t.incomeLabel,incomeAmount:n(`wizIncomeAmount`)??t.incomeAmount,balance:n(`wizBalance`)??t.balance}}function ft(e){let t=e.trim();if(t===``)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}function pt(e,t){let n=t.trim();return n===``?e:{...e,name:n}}function mt(e,t){let n=ft(t);return{...e,safetyBuffer:n??0}}function ht(e,t,n){let r=ft(t);return{...e,mainBalance:r===null?null:{amount:r,asOfDateTime:n}}}function gt(e,t,n){return e.mainBalance===null||!/^\d{4}-\d{2}-\d{2}$/.test(t)?e:{...e,mainBalance:{...e.mainBalance,asOfDateTime:t>n?n:t}}}function _t(e){return Object.keys(e.livingEstimates).length>0||Object.keys(e.potContributions).length>0||e.generators.some(vt)}function vt(e){switch(e.kind){case`recurring`:return(e.overrides??[]).some(e=>e.fundedFrom?.kind===`window`);case`irregular`:return e.dates.some(e=>e.fundedFrom?.kind===`window`);case`one-off`:return e.fundedFrom?.kind===`window`}}function yt(e){let t=e=>{if(e.fundedFrom?.kind!==`window`)return e;let{fundedFrom:t,...n}=e;return n};switch(e.kind){case`recurring`:return e.overrides===void 0?e:{...e,overrides:e.overrides.map(t)};case`irregular`:return{...e,dates:e.dates.map(t)};case`one-off`:return t(e)}}function bt(e,t,n){return e.anchorDate===t&&e.anchorCadence===n?e:{...e,anchorDate:t,anchorCadence:n,livingEstimates:{},potContributions:{},generators:e.generators.map(yt)}}function xt(e){let t=g(e,-4);return{id:`sample`,name:`Household`,anchorDate:t,anchorCadence:`fortnightly`,safetyBuffer:150,livingEstimates:{0:620},potContributions:{0:{rego:60,christmas:40}},mainBalance:{amount:2140.55,asOfDateTime:g(e,-2)},pots:[{id:`bills`,name:`Future bills`,balance:{amount:540,asOfDateTime:g(e,-2)},targetAmount:null,targetDate:null,mode:`passive`},{id:`rego`,name:`Car registration`,balance:{amount:260,asOfDateTime:g(e,-2)},targetAmount:680,targetDate:g(e,180),mode:`active`},{id:`christmas`,name:`Christmas`,balance:{amount:120,asOfDateTime:g(e,-2)},targetAmount:null,targetDate:null,mode:`passive`}],generators:[{id:`salary`,kind:`recurring`,label:`Salary`,entryType:`income`,amountKind:`fixed`,frequency:`fortnightly`,amount:2865,startDate:t,status:`confirmed`},{id:`rent`,kind:`recurring`,label:`Rent`,entryType:`expense`,amountKind:`fixed`,frequency:`fortnightly`,amount:650,startDate:g(t,1),status:`confirmed`},{id:`power`,kind:`recurring`,label:`Power`,entryType:`expense`,amountKind:`variable`,frequency:`monthly`,amount:185.4,startDate:g(e,6),status:`expected`},{id:`phone`,kind:`recurring`,label:`Phone & internet`,entryType:`expense`,amountKind:`fixed`,frequency:`monthly`,amount:99,startDate:g(e,11),status:`confirmed`,overrides:[{date:g(e,11),fundedFrom:{kind:`window`,index:0}}]},{id:`creditcard`,kind:`recurring`,label:`Credit card`,entryType:`expense`,amountKind:`variable`,frequency:`monthly`,amount:320,startDate:g(e,9),status:`expected`},{id:`streaming`,kind:`recurring`,label:`Streaming`,entryType:`expense`,amountKind:`fixed`,frequency:`monthly`,amount:22.99,startDate:g(e,4),status:`confirmed`,overrides:[{date:g(e,4),fundedFrom:{kind:`external`}}]},{id:`groceries`,kind:`recurring`,label:`Groceries`,entryType:`expense`,amountKind:`variable`,frequency:`weekly`,amount:180,startDate:g(e,2),status:`expected`},{id:`invoice`,kind:`one-off`,label:`Freelance invoice #114`,entryType:`income`,amountKind:`fixed`,date:g(e,5),amount:620,status:`expected`},{id:`rental`,kind:`recurring`,label:`Rental income`,entryType:`income`,amountKind:`fixed`,frequency:`monthly`,amount:430,startDate:g(e,8),status:`confirmed`},{id:`rego-bill`,kind:`one-off`,label:`Car registration`,entryType:`expense`,amountKind:`fixed`,date:g(e,180),amount:680,status:`confirmed`,fundedFrom:{kind:`pot`,potId:`rego`}},{id:`insurance`,kind:`irregular`,label:`Car insurance`,entryType:`expense`,amountKind:`fixed`,dates:[{date:g(e,30),amount:140,status:`confirmed`,fundedFrom:{kind:`pot`,potId:`bills`}},{date:g(e,61),amount:110,status:`expected`},{date:g(e,92),amount:110,status:`expected`}]}]}}var St=[`weekly`,`fortnightly`,`four-weekly`,`monthly`];function N(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function P(e){return typeof e==`string`&&/^\d{4}-\d{2}-\d{2}/.test(e)}function F(e){return typeof e==`number`&&Number.isFinite(e)}function Ct(e){return e===null||N(e)&&F(e.amount)&&P(e.asOfDateTime)}function wt(e){return N(e)?typeof e.id==`string`&&typeof e.name==`string`&&Ct(e.balance)&&(e.targetAmount===null||F(e.targetAmount))&&(e.targetDate===null||P(e.targetDate))&&(e.mode===`active`||e.mode===`passive`):!1}function Tt(e){if(!N(e)||typeof e.id!=`string`||typeof e.label!=`string`||e.entryType!==`income`&&e.entryType!==`expense`||e.amountKind!==`fixed`&&e.amountKind!==`variable`)return!1;switch(e.kind){case`recurring`:return F(e.amount)&&P(e.startDate)&&St.includes(e.frequency);case`one-off`:return F(e.amount)&&P(e.date);case`irregular`:return Array.isArray(e.dates)&&e.dates.every(e=>N(e)&&P(e.date)&&F(e.amount));default:return!1}}function Et(e){return N(e)&&Object.values(e).every(F)}function Dt(e){return N(e)&&Object.values(e).every(Et)}function Ot(e){let t;try{t=JSON.parse(e)}catch{return{ok:!1,error:`That file isn't valid JSON.`}}if(!N(t))return{ok:!1,error:`That file isn't a Fortify backup.`};let n=t.schemaVersion;if(typeof n!=`number`)return{ok:!1,error:`That file isn't a Fortify backup.`};if(n>1)return{ok:!1,error:`That backup was saved by a newer version of Fortify (format ${n}). Update Fortify and try again.`};let r=t.budget;return N(r)?typeof r.id!=`string`||typeof r.name!=`string`?{ok:!1,error:`That backup is missing its budget details.`}:!P(r.anchorDate)||!St.includes(r.anchorCadence)?{ok:!1,error:`That backup has no valid pay cycle.`}:!F(r.safetyBuffer)||!Ct(r.mainBalance)?{ok:!1,error:`That backup has an invalid balance or buffer.`}:!Array.isArray(r.pots)||!r.pots.every(wt)?{ok:!1,error:`That backup has an invalid savings pot.`}:!Array.isArray(r.generators)||!r.generators.every(Tt)?{ok:!1,error:`That backup has an invalid income or expense.`}:Et(r.livingEstimates)?Dt(r.potContributions)?{ok:!0,budget:r}:{ok:!1,error:`That backup has invalid savings contributions.`}:{ok:!1,error:`That backup has invalid living expenses.`}:{ok:!1,error:`That backup has no budget in it.`}}function kt(e){let t={schemaVersion:1,exportedAt:new Date().toISOString(),budget:e};return JSON.stringify(t,null,2)}function At(e,t){return`fortify-${e.name.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`budget`}-${t}.json`}var jt=`fortify`,Mt=1,I=`budgets`,L=`current`;function Nt(e){return new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`IndexedDB request failed`))})}function Pt(){return new Promise((e,t)=>{if(typeof indexedDB>`u`){t(Error(`This browser has no local storage available.`));return}let n;try{n=indexedDB.open(jt,Mt)}catch{t(Error(`Local storage is blocked in this browser.`));return}n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(I)||e.createObjectStore(I,{keyPath:`key`})},n.onsuccess=()=>e(n.result),n.onblocked=()=>t(Error(`Another Fortify tab is open. Close it and reload.`)),n.onerror=()=>t(Error(`Couldn't open local storage — it may be turned off.`))})}async function Ft(e,t){let n={key:L,schemaVersion:1,savedAt:new Date().toISOString(),budget:t};await new Promise((t,r)=>{let i=e.transaction(I,`readwrite`);i.objectStore(I).put(n),i.oncomplete=()=>t(),i.onabort=()=>r(i.error??Error(`Save was cancelled — storage may be full.`)),i.onerror=()=>r(i.error??Error(`Save failed.`))})}async function It(e){let t=await Nt(e.transaction(I,`readonly`).objectStore(I).get(L));if(t===void 0)return null;if(t.schemaVersion>1)throw Error(`Your saved budget was written by a newer version of Fortify. Update to open it.`);return t.budget}function Lt(e){switch(e.kind){case`saving`:return`<span class="save-state">Saving…</span>`;case`saved`:return`<span class="save-state is-saved" title="Saved to this browser at ${k(e.at)}">Saved</span>`;case`error`:return`<span class="save-state is-error" title="${k(e.message)}">Not saved</span>`;case`unavailable`:return`<span class="save-state is-error" title="${k(e.message)}">Not saving</span>`}}function Rt(e,t){return e.summary.hasBalance?t:`plan`}function zt(e,t){let{summary:n}=e;return t===`safe`?n.conservative??n.plan:t===`expected`?n.expected??n.plan:n.plan}function Bt(e,t){let n=O(e.summary.nextAnchorDate);return t===`plan`?`Planned surplus for this pay cycle. This is a forecast from your schedule, not money you have.`:t===`safe`?`Estimated safe to spend until ${n}, from confirmed money only.`:`Expected to spend until ${n}, including income that is not confirmed yet.`}function Vt(e,t){let n=!e.summary.hasBalance,r=(e,n,r)=>`
    <button class="mode-tab${t===e?` active`:``}" data-mode="${e}"
      ${r?`disabled`:``}
      ${r?`title="Add your current balance to see this"`:``}>
      ${n}
    </button>`;return`<div class="mode-tabs" role="tablist">
    ${r(`plan`,`Plan`,!1)}
    ${r(`safe`,`Safe to spend`,n)}
    ${r(`expected`,`Expected`,n)}
  </div>`}function Ht(e,t,n,r){let{summary:i}=e,a=i.balanceAgeDays!==null&&i.balanceAgeDays>7;return`
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
        ${i.hasBalance&&i.balanceAgeDays!==null?`${Ue(i.balanceAgeDays)}${a?` — worth refreshing`:``}`:`Without this, only the plan figure is available`}
      </span>
    </div>`}function Ut(e,t){return`
    <dialog id="settingsDialog" class="dialog">
      <form method="dialog" class="dialog-body">
        <h2>Settings</h2>

        <label class="field">
          <span>Budget name</span>
          <input type="text" id="setName" value="${k(t.name)}" maxlength="60">
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
    </dialog>`}function Wt(e){let{summary:t}=e,n=[];if(t.hasBalance&&t.balanceAgeDays!==null){let e=t.balanceAgeDays>7;n.push(`<span class="chip${e?` chip-warn`:``}">Balance updated ${Ue(t.balanceAgeDays)}</span>`)}else n.push(`<span class="chip chip-warn">No balance recorded</span>`);return n.push(`<span class="chip${t.unconfirmedCount>0?` chip-soft`:``}">${t.unconfirmedCount} unconfirmed ${t.unconfirmedCount===1?`entry`:`entries`}</span>`),n.push(`<span class="chip">Buffer ${E(t.safetyBuffer)}</span>`),n.push(`<span class="chip">Savings pots held separately</span>`),`<div class="assumptions">${n.join(``)}</div>`}function Gt(e,t){let n=e.planSurplus;return`
    <article class="window-card ${t?`current`:``} ${n<0?`over`:n<300?`tight`:``}">
      <p class="wc-label">${O(e.start)}</p>
      <p class="wc-date">to ${D(e.end)}</p>
      <dl class="wc-stats">
        <div><dt>In</dt><dd class="pos">${E(e.confirmedIncome+e.expectedIncome)}</dd></div>
        <div><dt>Automatic</dt><dd class="neg">${E(e.fixedExpenses)}</dd></div>
        <div><dt>Manual</dt><dd class="neg">${E(e.variableExpenses)}</dd></div>
        <div class="wc-net"><dt>Left over</dt><dd class="${n<0?`neg`:`pos`}">${E(n)}</dd></div>
      </dl>
    </article>`}function Kt(e,t,n){if(e.entryType===`income`)return`<td class="cell-assign"></td>`;let r=e=>e?` selected`:``,i=e.funding,a=t.map(e=>`<option value="window:${e.index}"${r(i.kind===`window`&&i.index===e.index)}>${D(e.start)}</option>`).join(``),o=n.map(e=>`<option value="pot:${k(e.id)}"${r(i.kind===`pot`&&i.potId===e.id)}>${k(e.name)}</option>`).join(``);return`
    <td class="cell-assign">
      <select class="${i.kind===`pot`?`assign from-pot`:i.kind===`external`?`assign external`:`assign`}" data-entry="${k(e.id)}" aria-label="Paid from">
        <optgroup label="Pay cycle">${a}</optgroup>
        ${o?`<optgroup label="From a pot">${o}</optgroup>`:``}
        <option value="external"${r(i.kind===`external`)}>N/A — paid elsewhere</option>
      </select>
    </td>`}function qt(e){let t=e.isSettled?`settled`:e.status;return e.entryType===`expense`&&e.amountKind===`variable`?`
      <td>
        <label class="paid-check${e.isSettled?` is-paid`:``}">
          <input type="checkbox" data-paid="${k(e.id)}"${e.isSettled?` checked`:``}>
          <span>${e.isSettled?`Paid`:`Mark paid`}</span>
        </label>
      </td>`:`<td><span class="status status-${t}">${e.statusLabel}</span></td>`}function Jt(e,t,n){let r=e.entryType===`income`,i=`
    <div class="amount-entry${e.isEstimate?` is-estimate`:``}">
      <span class="currency">$</span>
      <input
        type="number" inputmode="decimal" step="0.01" min="0"
        class="amount-input"
        data-entry="${k(e.id)}"
        value="${e.isEstimate?``:e.amount}"
        placeholder="${e.amount.toFixed(2)}"
        aria-label="Amount for ${k(e.label)}"
        title="${e.isEstimate?`Estimated — enter the real amount when the bill arrives`:`Actual amount`}">
    </div>`,a=r?`<td class="cell-amount pos" colspan="2">+${E(e.amount)}</td>`:e.amountKind===`fixed`?`<td class="cell-amount neg">${E(e.amount)}</td>
         <td class="cell-amount muted">—</td>`:`<td class="cell-amount muted">—</td>
         <td class="cell-amount">${i}</td>`;return`
    <tr class="${[r?`row-income`:``,e.fundingNote===null?``:`row-elsewhere`].filter(Boolean).join(` `)}">
      <td class="cell-date">${D(e.date)}</td>
      <td class="cell-label">
        <button type="button" class="label-edit" data-edit-generator="${k(e.generatorId)}"
          title="Edit ${k(e.label)}">${k(e.label)}</button>
        ${e.fundingNote===null?``:`<span class="funding-note">${k(e.fundingNote)}</span>`}
      </td>
      ${a}
      ${Kt(e,t,n)}
      ${qt(e)}
    </tr>`}function Yt(e){let t=e.planSurplus,n=e.livingEstimate,r=e.leftAfterLiving;return`
    <tfoot>
      <tr class="totals-row">
        <td colspan="2">Cycle subtotal</td>
        <td class="cell-amount neg">${e.fixedExpenses>0?E(e.fixedExpenses):`—`}</td>
        <td class="cell-amount neg">${e.variableExpenses>0?E(e.variableExpenses):`—`}</td>
        <td></td>
        <td class="cell-total neg">${E(e.chargedExpenses)} out</td>
      </tr>
      <tr class="pots-row">
        <td colspan="2">Into savings</td>
        <td colspan="3">
          <div class="pot-contribs">
            ${e.contributions.map(t=>`
                <label class="contrib">
                  <span class="contrib-name">${k(t.name)}</span>
                  <span class="currency">$</span>
                  <input
                    type="number" inputmode="decimal" step="0.01" min="0"
                    class="contrib-input"
                    data-window="${e.index}"
                    data-pot="${k(t.potId)}"
                    value="${t.amount===0?``:t.amount}"
                    placeholder="0.00"
                    aria-label="Into ${k(t.name)} from this pay">
                </label>`).join(``)}
          </div>
        </td>
        <td class="cell-total ${e.totalContributions>0?`saved`:`muted`}">
          ${e.totalContributions>0?`${E(e.totalContributions)} saved`:`—`}
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
          ${n===null?``:`${E(t)} less ${E(n)}`}
        </td>
        <td class="cell-total ${(r??t)<0?`neg`:`pos`}">${E(r??t)}</td>
      </tr>
    </tfoot>`}var Xt=`
  <thead>
    <tr>
      <th>Date</th>
      <th>What</th>
      <th class="r">Automatic</th>
      <th class="r">Manual</th>
      <th>Paid from</th>
      <th>Status</th>
    </tr>
  </thead>`;function Zt(e,t,n){let r=[...e.income,...e.expenses].sort((e,t)=>e.date.localeCompare(t.date)),i=r.length?r.map(e=>Jt(e,t,n)).join(``):`<tr><td colspan="6" class="empty">Nothing scheduled in this window.</td></tr>`;return`
    <section class="window-section">
      <header class="ws-header">
        <h3>${O(e.start)}</h3>
        <span class="ws-range">${D(e.start)} – ${D(e.end)}</span>
        <span class="ws-net ${e.planSurplus<0?`neg`:`pos`}">${E(e.planSurplus)}</span>
      </header>
      <div class="table-scroll">
        <table class="ledger">
          ${Xt}
          <tbody>${i}</tbody>
          ${Yt(e)}
        </table>
      </div>
    </section>`}function Qt(e){let{progress:t}=e,n=t.target===null||t.target===0?null:Math.min(100,t.balance/t.target*100),r=[];return t.target===null?r.push(`Set aside, no target`):t.isFunded?r.push(`Fully funded`):(r.push(`${E(t.remaining??0)} to go`),t.requiredPerCycle!==null&&t.requiredPerCycle>0&&r.push(`${E(t.requiredPerCycle)} per cycle`),t.isOverdue&&r.push(`target date passed`)),`
    <article class="pot${t.isOverdue?` pot-overdue`:``}">
      <div class="pot-head">
        <h4><button type="button" class="label-edit" data-edit-pot="${k(e.id)}"
          title="Edit ${k(e.name)}">${k(e.name)}</button></h4>
        <span class="pot-balance">${E(t.balance)}${t.target===null?``:` <span class="pot-target">of ${E(t.target)}</span>`}</span>
      </div>
      ${n===null?``:`<div class="pot-bar"><span style="width:${n.toFixed(1)}%"></span></div>`}
      <p class="pot-detail">${r.join(` · `)}</p>
    </article>`}function $t(e,t,n){return e.length===0?``:`
    <section class="window-section">
      <header class="ws-header">
        <h3>Further ahead</h3>
        <span class="ws-range">Beyond the cycles above</span>
      </header>
      <div class="table-scroll">
        <table class="ledger">${Xt}<tbody>${e.slice(0,8).map(e=>Jt(e,t,n)).join(``)}</tbody></table>
      </div>
    </section>`}function en(e,t){let{budgetName:n,today:r,mode:i,saveState:a,theme:o,settings:s}=t,c=Rt(e,i),l=zt(e,c);return`
    <header class="app-header">
      <div>
        <h1>Fortify</h1>
        <p class="subtitle">${k(n)} · ${O(r)}</p>
      </div>
      <div class="header-actions">
        ${Lt(a)}
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
      ${Vt(e,c)}
      <p class="runway-figure ${l<0?`neg`:``}">${E(l)}</p>
      <p class="runway-caption">${Bt(e,c)}</p>
      ${Wt(e)}
      ${Ht(e,s.mainBalance,s.balanceAsOf,r)}
    </section>

    <section class="windows">
      ${e.windows.map((e,t)=>Gt(e,t===0)).join(``)}
    </section>

    ${`<section class="pots"><div class="section-head"><h2>Savings pots</h2>
        <button type="button" class="ghost-btn" id="addPot">Add a pot</button></div><div class="pot-grid">${e.pots.length?e.pots.map(Qt).join(``):`<p class="empty-note">No savings pots yet. A pot holds money set aside for something later — a rego bill, Christmas.</p>`}</div></section>`}

    <section class="detail">
      <div class="section-head">
        <h2>Spend plan</h2>
        <button type="button" class="ghost-btn" id="addGenerator">Add income or bill</button>
      </div>
      ${e.windows.map(t=>Zt(t,e.windows,e.pots)).join(``)}
      ${$t(e.upcomingBeyond,e.windows,e.pots)}
    </section>

    ${Ut(t,s)}`}var tn=`fortify.theme`;function nn(){try{let e=localStorage.getItem(tn);return e===`light`||e===`dark`?e:null}catch{return null}}function rn(e){try{localStorage.setItem(tn,e)}catch{}}function an(){return window.matchMedia?.(`(prefers-color-scheme: light)`).matches?`light`:`dark`}function on(){return nn()??an()}function R(e){document.documentElement.dataset.theme=e}function sn(e){rn(e),R(e)}function cn(e){window.matchMedia?.(`(prefers-color-scheme: light)`).addEventListener(`change`,()=>{nn()===null&&e(an())})}var ln=4,z=document.querySelector(`#app`),B=m(),V=xt(B),H=!1,un=`safe`,U={kind:`saving`},W=null,G=on(),K=null,q=null,J=null,Y=null,X=null,Z=null;function dn(e){return e instanceof Error?e.message:String(e)}async function fn(){if(W!==null){U={kind:`saving`};try{await Ft(W,V),U={kind:`saved`,at:new Date().toLocaleTimeString()}}catch(e){U={kind:`error`,message:dn(e)}}$()}}function Q(e){V=e,$(),fn()}function pn(){let e=new Blob([kt(V)],{type:`application/json`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=At(V,B),n.click(),URL.revokeObjectURL(t)}function mn(){let e=document.createElement(`input`);e.type=`file`,e.accept=`application/json,.json`,e.addEventListener(`change`,()=>{let t=e.files?.[0];if(t===void 0)return;let n=new FileReader;n.onload=()=>{let e=Ot(String(n.result));if(!e.ok){window.alert(`Couldn't import that file.\n\n${e.error}`);return}window.confirm(`Replace your current budget with "${e.budget.name}"?\n\nEverything currently in Fortify will be overwritten.`)&&Q(e.budget)},n.onerror=()=>window.alert(`Couldn't read that file.`),n.readAsText(t)}),e.click()}function hn(e){let t=t=>e.querySelector(`#${t}`)?.value??``,n=t(`setAnchor`),r=t(`setCadence`),i=n!==``&&(n!==V.anchorDate||r!==V.anchorCadence);if(i&&_t(V)&&!window.confirm(`Changing your pay cycle clears anything tied to a particular cycle — living expense estimates, savings contributions, and bills you assigned to a specific pay.

Your income, bills and pots are kept. Continue?`))return;let a=pt(V,t(`setName`));a=mt(a,t(`setBuffer`)),i&&(a=bt(a,n,r)),Q(a)}function gn(){let e=document.querySelector(`#generatorDialog`);e!==null&&K!==null&&(K={...K,draft:j(e,K.draft)}),$()}function _n(e){let t=V.generators.find(t=>t.id===e);q=null,K=t===void 0?{draft:{...Re(B),id:C(`gen`)},isNew:!0}:{draft:ze(t,B),isNew:!1},$()}function vn(){K=null,q=null,$()}function yn(){let e=document.querySelector(`#generatorDialog`);if(e===null||K===null)return;let t=j(e,K.draft),n=Be(t);if(!n.ok){K={...K,draft:t},q=n.error,$();return}let r=K.isNew?Ae(V,n.generator):je(V,n.generator);K=null,q=null,Q(r)}function bn(){if(K===null||K.isNew)return;let e=K.draft.label||`this entry`;if(!window.confirm(`Delete ${e}? Every occurrence of it goes too.`))return;let t=Me(V,K.draft.id);K=null,Q(t)}function xn(){let e=document.querySelector(`#generatorDialog`);if(e===null||K===null)return;e.open||e.showModal();let t=e.querySelector(`#genError`);t!==null&&q!==null&&(t.textContent=q,t.hidden=!1),e.querySelectorAll(`input[name="genKind"], input[name="genAmountKind"]`).forEach(e=>e.addEventListener(`change`,gn)),e.querySelector(`#addInstalment`)?.addEventListener(`click`,()=>{if(K===null)return;let t=j(e,K.draft);K={...K,draft:{...t,instalments:[...t.instalments,{date:B,amount:``}]}},$()}),e.querySelectorAll(`[data-inst-remove]`).forEach(t=>{t.addEventListener(`click`,()=>{if(K===null)return;let n=Number(t.dataset.instRemove),r=j(e,K.draft);K={...K,draft:{...r,instalments:r.instalments.filter((e,t)=>t!==n)}},$()})}),e.querySelector(`#genSave`)?.addEventListener(`click`,yn),e.querySelector(`#genCancel`)?.addEventListener(`click`,vn),e.querySelector(`#genDelete`)?.addEventListener(`click`,bn),e.addEventListener(`cancel`,e=>{e.preventDefault(),vn()})}function Sn(e){let t=V.pots.find(t=>t.id===e);Y=null,J=t===void 0?{draft:{...Ye(B),id:C(`pot`)},isNew:!0}:{draft:Xe(t,B),isNew:!1},$()}function Cn(){let e=document.querySelector(`#potDialog`);if(e===null||J===null)return;let t=et(e,J.draft),n=Ze(t,B);if(!n.ok){J={...J,draft:t},Y=n.error,$();return}let r=J.isNew?Ne(V,n.pot):Pe(V,n.pot);J=null,Y=null,Q(r)}function wn(){if(J===null||J.isNew)return;let e=J.draft.name||`this pot`;if(!window.confirm(`Delete ${e}? Anything paid from it goes back to being paid from its own pay cycle.`))return;let t=Ie(V,J.draft.id);J=null,Q(t)}function Tn(){let e=document.querySelector(`#potDialog`);if(e===null||J===null)return;e.open||e.showModal();let t=e.querySelector(`#potError`);t!==null&&Y!==null&&(t.textContent=Y,t.hidden=!1),e.querySelectorAll(`input[name="potMode"]`).forEach(t=>t.addEventListener(`change`,()=>{J!==null&&(J={...J,draft:et(e,J.draft)},$())})),e.querySelector(`#potSave`)?.addEventListener(`click`,Cn),e.querySelector(`#potCancel`)?.addEventListener(`click`,()=>{J=null,Y=null,$()}),e.querySelector(`#potDelete`)?.addEventListener(`click`,wn),e.addEventListener(`cancel`,e=>{e.preventDefault(),J=null,Y=null,$()})}function En(){return!z||X===null?null:dt(z,X)}function Dn(e){let t=En();if(t!==null){if(e>0){let e=rt(t,t.step);if(e!==null){X=t,Z=e,$();return}}if(e>0&&t.step===3){X=null,Z=null,Q(at(t,B));return}X={...t,step:Math.max(1,t.step+e)},Z=null,$()}}function On(){!z||X===null||(z.innerHTML=ut(X,Z),z.querySelectorAll(`input, select`).forEach(e=>{e.addEventListener(`change`,()=>{let e=En();e!==null&&(X=e,$())})}),z.querySelector(`#wizNext`)?.addEventListener(`click`,()=>{Dn(1)}),z.querySelector(`#wizBack`)?.addEventListener(`click`,()=>{Dn(-1)}),z.querySelector(`#wizSample`)?.addEventListener(`click`,()=>{X=null,Z=null,Q(xt(B))}))}function $(){if(!z||!H)return;if(X!==null){On();return}z.innerHTML=en(ke(V,B,ln),{budgetName:V.name,today:B,mode:un,saveState:U,theme:G,settings:{name:V.name,anchorDate:V.anchorDate,anchorCadence:V.anchorCadence,safetyBuffer:V.safetyBuffer,mainBalance:V.mainBalance?.amount??null,balanceAsOf:V.mainBalance?.asOfDateTime.slice(0,10)??null}}),K!==null&&z.insertAdjacentHTML(`beforeend`,Ke(K.draft,K.isNew)),J!==null&&z.insertAdjacentHTML(`beforeend`,$e(J.draft,J.isNew,Le(V,J.draft.id))),z.querySelectorAll(`.mode-tab`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.mode;(t===`plan`||t===`safe`||t===`expected`)&&(un=t,$())})}),z.querySelectorAll(`.assign`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.entry;t!==void 0&&Q(s(V,t,e.value))})}),z.querySelectorAll(`.amount-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.entry;t!==void 0&&Q(c(V,t,e.value))})}),z.querySelectorAll(`.living-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.window);Number.isInteger(t)&&Q(u(V,t,e.value))})}),z.querySelectorAll(`.contrib-input`).forEach(e=>{e.addEventListener(`change`,()=>{let t=Number(e.dataset.window),n=e.dataset.pot;!Number.isInteger(t)||n===void 0||Q(d(V,t,n,e.value))})}),z.querySelectorAll(`[data-paid]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.paid;t!==void 0&&Q(l(V,t,e.checked,B))})}),z.querySelector(`#balanceInput`)?.addEventListener(`change`,e=>{let t=e.currentTarget;Q(ht(V,t.value,B))}),z.querySelector(`#balanceDate`)?.addEventListener(`change`,e=>{let t=e.currentTarget;Q(gt(V,t.value,B))});let e=z.querySelector(`#settingsDialog`);z.querySelector(`#settingsBtn`)?.addEventListener(`click`,()=>{e?.showModal()}),z.querySelector(`#newBudgetBtn`)?.addEventListener(`click`,()=>{window.confirm(`Start a new budget? This replaces what is here now, so export a backup first if you want to keep it.`)&&(X=nt(B),Z=null,$())}),e?.addEventListener(`close`,()=>{e.returnValue===`save`&&hn(e)}),z.querySelector(`#themeBtn`)?.addEventListener(`click`,()=>{G=G===`dark`?`light`:`dark`,sn(G),$()}),z.querySelector(`#exportBtn`)?.addEventListener(`click`,pn),z.querySelector(`#importBtn`)?.addEventListener(`click`,mn),z.querySelector(`#addGenerator`)?.addEventListener(`click`,()=>{_n(null)}),z.querySelectorAll(`[data-edit-generator]`).forEach(e=>{e.addEventListener(`click`,()=>{_n(e.dataset.editGenerator??null)})}),z.querySelector(`#addPot`)?.addEventListener(`click`,()=>{Sn(null)}),z.querySelectorAll(`[data-edit-pot]`).forEach(e=>{e.addEventListener(`click`,()=>{Sn(e.dataset.editPot??null)})}),xn(),Tn()}async function kn(){R(G),cn(e=>{G=e,R(e),$()});try{W=await Pt();let e=await It(W);if(e===null){X=nt(B),H=!0,$();return}V=e,U={kind:`saved`,at:new Date().toLocaleTimeString()}}catch(e){U={kind:`unavailable`,message:dn(e)}}H=!0,$()}kn();