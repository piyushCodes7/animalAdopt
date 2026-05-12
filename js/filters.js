
const filterButtons = document.querySelectorAll('.filter-btn');
const petCards = document.querySelectorAll('.pet-card');

filterButtons.forEach(button=>{
button.addEventListener('click',()=>{

filterButtons.forEach(btn=>btn.classList.remove('active'));
button.classList.add('active');

const filter = button.dataset.filter;

petCards.forEach(card=>{
if(filter === 'all' || card.dataset.type === filter){
card.style.display='block';
}else{
card.style.display='none';
}
});

});
});
